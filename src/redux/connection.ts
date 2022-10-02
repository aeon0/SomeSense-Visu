import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxConnection {
  serverName: string;
  topicSubs: string[];
  connected: boolean,
}

const initialState: IReduxConnection = {
  serverName: "somesense_server",
  topicSubs: [
    "somesense_app",
    "somesense_app_sync",
    "somesense_recmeta"
  ],
  connected: false,
}

export const setServerName = createAction<string>('connection/setServerName')
export const setTopicSubs = createAction<[string]>('connection/setTopicSubs')
export const setConnected = createAction<boolean>('connection/setConnected')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setServerName, (state, action) => {
      state.serverName = action.payload;
    })
    .addCase(setTopicSubs, (state, action) => {
      state.topicSubs = action.payload;
    })
    .addCase(setConnected, (state, action) => {
      state.connected = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
