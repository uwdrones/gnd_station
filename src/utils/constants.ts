export const leftPipeline: string =
  'libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@88000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! videoconvert ! x264enc bitrate=500 speed-preset=ultrafast tune=zerolatency ! h264parse ! rtph264pay config-interval=1 ! appsink sync=false';
export const rightPipeline: string =
  'libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@80000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! videoconvert ! x264enc bitrate=500 speed-preset=ultrafast tune=zerolatency ! h264parse ! rtph264pay config-interval=1 ! appsink sync=false';
