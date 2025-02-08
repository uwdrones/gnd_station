import { Injectable } from '@nestjs/common';
import { exec, ChildProcessWithoutNullStreams } from 'child_process';
import { leftPipeline, rightPipeline } from 'src/utils/constants';

@Injectable()
export class StreamService {
  private leftCameraProcess: ChildProcessWithoutNullStreams;
  private rightCameraProcess: ChildProcessWithoutNullStreams;

  public startBothCameras() {
    this.startLeftCamera();
    this.startRightCamera();
  }

  public startLeftCamera() {
    this.leftCameraProcess = exec(`gst-launch-1.0 ${this.leftPipeline}`);
    this.leftCameraProcess.stdout.on('data', (data) => {
      console.log('Left Camera Stream Output:', data);
    });
    this.leftCameraProcess.stderr.on('data', (data) => {
      console.error('Left Camera Stream Error:', data);
    });
    this.leftCameraProcess.on('close', (code) => {
      console.log('Left Camera Stream Process Closed with Code:', code);
    });
  }

  public startRightCamera() {
    this.rightCameraProcess = exec(`gst-launch-1.0 ${this.rightPipeline}`);
    this.rightCameraProcess.stdout.on('data', (data) => {
      console.log('Right Camera Stream Output:', data);
    });
    this.rightCameraProcess.stderr.on('data', (data) => {
      console.error('Right Camera Stream Error:', data);
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
}
