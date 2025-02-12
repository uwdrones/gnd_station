import { Controller, Get, Post, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

@Controller('analog-camera')
export class AnalogCameraController {
  private ffmpegProcess: ChildProcessWithoutNullStreams | null = null;

  @Post('start')
  startStream() {
    if (this.ffmpegProcess) {
      return { message: 'Stream is already running!' };
    }

    this.ffmpegProcess = spawn('ffmpeg', [
      '-f', 'v4l2',           
      '-i', '/dev/video0',     
      '-vcodec', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'zerolatency',
      '-f', 'matroska', 'pipe:1',
    ]);

    this.ffmpegProcess.stderr.on('data', (data) => {
      console.error(`FFmpeg Error: ${data}`);
    });

    return { message: 'Stream started successfully!' };
  }

  @Get('stream')
  getStream(@Res() res: Response) {
    if (!this.ffmpegProcess) {
      return res.status(404).send('Stream is not running');
    }

    res.setHeader('Content-Type', 'video/x-matroska');
    this.ffmpegProcess.stdout.pipe(res);

    res.on('close', () => {
      console.log('Client disconnected from stream.');
    });
  }

  @Delete('stop')
  stopStream() {
    if (!this.ffmpegProcess) {
      return { message: 'Stream is not running!' };
    }

    this.ffmpegProcess.kill();
    this.ffmpegProcess = null;
    return { message: 'Stream stopped successfully!' };
  }
}

