import { Injectable } from '@nestjs/common';
import { exec, ChildProcessWithoutNullStreams } from 'child_process';
import * as WebSocket from 'ws';
import {leftPipeline, rightPipeline} from 'src/utils/constants';

@Injectable()
export class StreamService {
  private leftCameraProcess: ChildProcessWithoutNullStreams;
  private rightCameraProcess: ChildProcessWithoutNullStreams;
  private wss: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();
  
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.wss.on('connection', (ws) => {
      console.log('Client connected');
      this.clients.add(ws);
      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });
    });
  }

  public startBothCameras() {
    this.startLeftCamera();
    this.startRightCamera();
  }
  
  public startLeftCamera() {
    this.leftCameraProcess = exec(`gst-launch-1.0 ${StreamService.leftPipeline}`);

    this.leftCameraProcess.stdout.on('data', (data) => {
      this.broadcastFrame(data);
    });

    this.leftCameraProcess.stderr.on('data', (data) => {
      console.error('Left Camera Stream Error:', data.toString());
    });

    this.leftCameraProcess.on('close', (code) => {
      console.log('Left Camera Stream Process Closed with Code:', code);
    });
  }

  public startRightCamera() {
    this.rightCameraProcess = exec(`gst-launch-1.0 ${StreamService.rightPipeline}`);

    this.rightCameraProcess.stdout.on('data', (data) => {
      this.broadcastFrame(data);
    });

    this.rightCameraProcess.stderr.on('data', (data) => {
      console.error('Right Camera Stream Error:', data.toString());
    });

    this.rightCameraProcess.on('close', (code) => {
      console.log('Right Camera Stream Process Closed with Code:', code);
    });
  }

  public stopBothCameras() {
    this.stopLeftCamera();
    this.stopRightCamera();
  }

  public stopLeftCamera() {
    if (this.leftCameraProcess) {
      this.leftCameraProcess.kill();
      console.log('Left Camera Stream Stopped');
    } else {
      console.log('Left Camera Stream is not running');
    }
  }

  public stopRightCamera() {
    if (this.rightCameraProcess) {
      this.rightCameraProcess.kill();
      console.log('Right Camera Stream Stopped');
    } else {
      console.log('Right Camera Stream is not running');
    }
  }

  private broadcastFrame(frame: Buffer) {
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(frame);
      }
    }
  }
}
