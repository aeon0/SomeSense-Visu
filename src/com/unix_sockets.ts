import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'


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
          ipc.log("## connected to server ##");
          store.dispatch(setConnected());
          ipc.of.server.emit('client.register', {
            id: ipc.config.id,
          });
      });
      ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        store.dispatch(resetWorld());
        ipc.log('disconnected from server');
      });

      ipc.of.server.on('server.frame', (data: any) => {
        // TODO: the parsing could have all sorts of missing fields or additional fields
        //       Ideally this would be checked somehow, but for now... whatever
        const frameData: IReduxWorld = JSON.parse(data.frame);
        store.dispatch(updateWorld(frameData));
      });
  });
}
