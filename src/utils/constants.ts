// TODO: PLACEHOLDER FOR MAIN CONSTANTS SUCH AS SERVER ADDRESSES & OTHER MAGIC NUMBERS
public static readonly leftPipeline: string = ('libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@88000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! ' +
      'videoconvert ! x264enc bitrate=500 speed-preset=ultrafast ! rtph264pay ! udpsink host=100.102.125.110 port=3000');
public static readonly rightPipeline: string = ('libcamerasrc camera-name="/base/axi/pcie@120000/rp1/i2c@80000/imx219@10" ! video/x-raw,width=640,height=480,framerate=30/1,format=NV12 ! ' +
      'videoconvert ! x264enc bitrate=500 speed-preset=ultrafast ! rtph264pay ! udpsink host=100.102.125.110 port=3000');
