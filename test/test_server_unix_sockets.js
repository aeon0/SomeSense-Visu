const ipc = require('../node_modules/node-ipc');
const fs = require('fs');


let frameData = {
  tracks: [
    {
      trackId: "0",
      class: 0,
      position: [5, 0, 10],
      rotation: [-0.05, 0.4, -0.1],
      height: 1.5,
      width: 0.5,
      depth: 0,
      ttc: 1,
    },
    {
      trackId: "1",
      class: 4,
      position: [-2, 0, 15],
      rotation: [-0.05, 0.4, -0.1],
      height: 1.5,
      width: 2,
      depth: 4,
      ttc: 0.4,
    }
  ],
  sensor: {
    position: [0, 1.2, -0.5],
    rotation: [0, 0, 0],
    imageBase64: null,
    fovHorizontal: (1/2)*Math.PI,
    fovVertical: (1/4)*Math.PI,
  },
  timestamp: 0
};

var sockets = {};
var frame = 0;

ipc.config.id = 'server';
ipc.config.silent=true;

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

ipc.serve(() => {
  ipc.server.on('client.register', (data, socket) => {
    // Register Client
    sockets[data.id] = socket;
  });
  ipc.server.on("socket.disconnected", socket => {
    delete sockets[socket.id];
  });
});
ipc.server.start()

const runServer = async _ => {
  while (true) {
    // Send data to each socket (stop in case there is no client to serve)
    if(Object.keys(sockets).length > 0) {
      frame++;
      if(frame >= 30) frame = 1; // There are only 30 frames for the video data
      frameData.timestamp++;
      
      // Change 2D Object
      frameData.tracks[0].position[0] += 0.1;
      frameData.tracks[0].height += 0.03;
      frameData.tracks[0].width += 0.02;
      if(frameData.tracks[0].position[0] > 8) {
        frameData.tracks[0].position[0] = -3;
        frameData.tracks[0].height = 1.5;
        frameData.tracks[0].width = 0.5;
      }

      // Change 3D Object
      /*
      frameData.tracks[1].position[2] += 0.1;
      if(frameData.tracks[1].position[2] > 30) {
        frameData.tracks[1].position[2] = 15;
      }
      frameData.tracks[1].width += 0.03;
      if(frameData.tracks[1].width > 4) frameData.tracks[1].width = 2;
      frameData.tracks[1].height += 0.01;
      if(frameData.tracks[1].height > 4) frameData.tracks[1].height = 1.5;
      frameData.tracks[1].depth += 0.05;
      if(frameData.tracks[1].depth > 7) frameData.tracks[1].depth = 4;
      */

      // Read from video frames on file system
      let imgPath = "00000" + frame.toString();
      imgPath = "../assets/sample_video_frames/" + imgPath.substring(imgPath.length - 6) + ".jpg";

      const binaryImg = fs.readFileSync(imgPath);
      const base64Img = "data:image/jpeg;base64," + new Buffer.from(binaryImg).toString('base64');

      frameData.sensor.imageBase64 = base64Img;
      for (const key of Object.keys(sockets)) {
        ipc.server.emit(sockets[key], 'server.frame', {
          frame: JSON.stringify(frameData),
        });
      }
    }
    await Sleep(100);
  }
};

runServer();
