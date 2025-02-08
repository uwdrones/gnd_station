import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class StreamService {
  private leftPipeline: string;
  private rightPipeline: string;

  constructor() {
    this.leftPipeline = (
      'libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@88000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! ' +
      'videoconvert ! x264enc bitrate=500 speed-preset=ultrafast ! rtph264pay ! udpsink host=100.102.125.110 port=3000'
    );
    this.rightPipeline = (
      'libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@80000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! ' +
      'videoconvert ! x264enc bitrate=500 speed-preset=ultrafast ! rtph264pay ! udpsink host=100.102.125.110 port=3000'
    );
  }

 public startStreaming() {
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
