const ipc = require('../node_modules/node-ipc');

let baseData = {
  "objects": [
    {
      "trackId": "0",
      "class": "PED",
      "depth": false,
      "position": [10, 1, 10],
      "height": 1.5,
      "width": 0.5
    },
    {
      "trackId": "1",
      "class": "Car",
      "depth": false,
      "position": [-2, 0, 20],
      "height": 1.5,
      "width": 2
    }
  ],
  "timestamp": 0
};

var sockets = {};
var frame = null;

ipc.config.id = 'server';

setInterval(() => { 
  // Send data to each socket (stop in case there is no client to serve)
  if(Object.keys(sockets).length > 0) {
    for (const key of Object.keys(sockets)) {
      console.log("Send data to: " + key);
    }
  }
}, 2000);

ipc.serve(() => {
  ipc.server.on('client.register', (data, socket) => {
    // Register Client
    console.log("CLIENT REGISTERS " + data.id);
    sockets[data.id] = socket;
  });
  ipc.server.on("socket.disconnected", socket => {
    console.log("Remove: " + socket.id);
    delete sockets[socket.id];
  });
});
ipc.server.start()
