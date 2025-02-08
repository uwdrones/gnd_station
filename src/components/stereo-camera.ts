import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import {leftPipeline, rightPipeline} from 'src/utils/constants';

@Injectable()
export class StreamService {
  
 public startBothCameras() {
    this.startLeftCamera();
    this.startRightCamera();
  }

  public startLeftCamera() {
    const process = exec(`gst-launch-1.0 ${this.leftPipeline}`);
    process.stdout.on('data', (data) => {
      console.log('Left Camera Stream Output:', data);
    });
    process.stderr.on('data', (data) => {
      console.error('Left Camera Stream Error:', data);
    });
    process.on('close', (code) => {
      console.log('Left Camera Stream Process Closed with Code:', code);
    });
  }

  public startRightCamera() {
    const process = exec(`gst-launch-1.0 ${this.rightPipeline}`);
    process.stdout.on('data', (data) => {
      console.log('Right Camera Stream Output:', data);
    });
    process.stderr.on('data', (data) => {
      console.error('Right Camera Stream Error:', data);
    });
    process.on('close', (code) => {
      console.log('Right Camera Stream Process Closed with Code:', code);
    });
  }
}
