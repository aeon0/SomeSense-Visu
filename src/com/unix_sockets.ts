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
  ipc.config.retry = 2000; // time between reconnects in ms
  // ipc.config.maxRetries = 5 as any; // types are wrong...

  store.dispatch(setConnecting());

  ipc.connectTo('server', () => {
      ipc.of.server.on('connect', () => {
          ipc.log("## connected to server ##");
          store.dispatch(setConnected());
          ipc.of.server.emit('visu.message', {
            id : ipc.config.id,
            message: 'hello'
          });
      });
      ipc.of.server.on('disconnect', () => {
        if (!startConnecting) {
          store.dispatch(setConnecting());
        }
        ipc.log('disconnected from server');
      });
      // Currently this should never be hit as maxRetries is infinity
      ipc.of.server.on('destroy', () => {
        ipc.log('destroy connection');
        store.dispatch(setDisconnected());
      });

      ipc.of.server.on('server.message', (data: any) => {
        console.log(data);
      });
  });
}
