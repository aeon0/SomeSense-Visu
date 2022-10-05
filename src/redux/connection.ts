import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxConnection {
  serverName: string;
  topicSubs: string[];
  ip: string,
  port: number,
  connected: boolean,
}

const initialState: IReduxConnection = {
  // Ecal Settings
  serverName: "somesense_server",
  topicSubs: [
    "somesense_app",
    "somesense_app_sync",
    "somesense_app_recmeta"
  ],
  // Custom Tcp Sockets settings
  ip: "localhost", // 'localhost'
  port: 8999,
  connected: false,
}

export const setServerName = createAction<string>('connection/setServerName')
export const setTopicSubs = createAction<[string]>('connection/setTopicSubs')
export const setIp = createAction<string>('connection/setIp')
export const setPort = createAction<number>('connection/setPort')
export const setConnected = createAction<boolean>('connection/setConnected')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setServerName, (state, action) => {
      state.serverName = action.payload;
    })
    .addCase(setTopicSubs, (state, action) => {
      state.topicSubs = action.payload;
    })
    .addCase(setIp, (state, action) => {
      state.ip = action.payload;
    })
    .addCase(setPort, (state, action) => {
      state.port = action.payload;
    })
    .addCase(setConnected, (state, action) => {
      state.connected = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
