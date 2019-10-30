const ipc = require('../node_modules/node-ipc');

ipc.config.id = 'server';

ipc.serve(() => {
    ipc.server.on('visu.message', (data, socket) => {
      console.log("recived message");
      console.log(data);
      ipc.server.emit(socket, 'server.message', {
        id: ipc.config.id,
        message: "Hello from server!"
      });
    });
});

ipc.server.start()
