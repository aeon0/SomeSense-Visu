import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { setConnecting, setConnected, setDisconnected } from '../redux/connection/actions'


// Listen to the change in variable for connection
let startConnecting = false;
store.subscribe(() => {
  if (startConnecting !== store.getState().connection.connecting) {
    startConnecting = store.getState().connection.connecting;
    if (startConnecting) {
      StartIPC();
    }
  }
});


export function StartIPC() {
  const ipc = new IPC();
  ipc.config.id = 'visu_client';
  ipc.config.retry = 2000; // time between reconnects in ms#

  store.dispatch(setConnecting());

  ipc.connectTo('server', () => {
      ipc.of.server.on('connect', () => {
          ipc.log("## connected to server edit ##");
          store.dispatch(setConnected());
          ipc.of.server.emit('client.register', {
            id: ipc.config.id,
          });
      });
      ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        ipc.log('disconnected from server');
      });

      ipc.of.server.on('server.message', (data: any) => {
        console.log(data);
      });
  });
}
