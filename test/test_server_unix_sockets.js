const ipc = require('../node_modules/node-ipc');
const fs = require('fs');

const FRAME_LENGTH = 50; // in [ms] -> 20fps

let sentFirstFrame = false;
let sockets = {};
let frame = 0;
let stepForward = false;
let stepBackward = false;

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
  sensors: [
    {
      position: [0, 1.2, -0.5],
      rotation: [0, 0, 0],
      imageBase64: null,
      fovHorizontal: (1/2)*Math.PI,
      fovVertical: (1/4)*Math.PI,
      timestamp: null,
    }
  ],
  timestamp: null,
  isRecording: true,
  recLength: Math.floor(30*FRAME_LENGTH*1000), // test video has 30 frames * FRAME_LENGTH * 1000 to get us
  isPlaying: false,
};

ipc.config.id = 'server';
ipc.config.rawBuffer=true;
ipc.config.silent=true;

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

ipc.serve("/tmp/unix-socket", () => {
  ipc.server.on('data', (data, socket) => {
    jsonObj = JSON.parse(data.toString());
    if(jsonObj["type"] == "client.register") {
      sockets[jsonObj["data"]["id"]] = socket;
      console.log("Client Registred");
      sentFirstFrame = false;
    }
    else if(jsonObj["type"] == "client.play_rec") {
      console.log("Client: Play recording");
      frameData.isPlaying = true;
    }
    else if(jsonObj["type"] == "client.pause_rec") {
      console.log("Client: Pause recording");
      frameData.isPlaying = false;
    }
    else if(jsonObj["type"] == "client.step_forward") {
      console.log("Client: Step forward");
      stepForward = true;
    }
    else if(jsonObj["type"] == "client.step_backward") {
      console.log("Client: Step backward");
      stepBackward = true;
    }
    else if(jsonObj["type"] == "client.jump_to_ts") {
      const ts = jsonObj["data"];
      console.log("Client: Jump to ts: " + ts);
      frame = Math.floor(ts / (50 * 1000)) - 1;
      console.log("new frame: " + frame);
    }
    else {
      console.log("Unkown request from client: " + jsonObj["type"]);
    }
  });
  ipc.server.on("socket.disconnected", socket => {
    delete sockets[socket.id];
  });
});
ipc.server.start()

const runServer = async _ => {
  while (true) {
    // Send data to each socket (stop in case there is no client to serve)
    if((Object.keys(sockets).length > 0 && frameData.isPlaying) || !sentFirstFrame || stepForward || stepBackward) {
      sentFirstFrame = true;
      stepForward = false;
      if (stepBackward) frame--;
      else frame++;
      stepBackward = false;
      if(frame >= 30 || frame <= 0) frame = 1; // There are only 30 frames for the video data
      frameData.timestamp = Math.floor((frame - 1) * 50 * 1000);
      
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

      try {
        const binaryImg = fs.readFileSync(imgPath);
        const base64Img = "data:image/jpeg;base64," + new Buffer.from(binaryImg).toString('base64');
  
        // Currently expect only one sensor
        frameData.sensors[0].imageBase64 = base64Img;
        const msg = JSON.stringify({
          "type": "server.frame",
          "data": frameData
        });
  
        for (const key of Object.keys(sockets)) {
          ipc.server.emit(sockets[key], msg + "\n");
        }
      } catch (err) {
        console.log(err);
      }

    }
    await Sleep(FRAME_LENGTH); // Test with 20 fps (50ms per frame)
  }
};

runServer();
