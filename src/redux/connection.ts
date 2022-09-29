import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxConnection {
  serverName: string;
  topicSubs: string[];
  waitingForData: boolean;
}

const initialState: IReduxConnection = {
  serverName: "somesense_server",
  topicSubs: ["somesense_app"],
  waitingForData: true,
}

export const setServerName = createAction<string>('connection/setServerName')
export const setTopicSubs = createAction<[string]>('connection/setTopicSubs')
export const setWaitingForData = createAction<boolean>('connection/setWaitingForData')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setServerName, (state, action) => {
      state.serverName = action.payload;
    })
    .addCase(setTopicSubs, (state, action) => {
      state.topicSubs = action.payload;
    })
    .addCase(setWaitingForData, (state, action) => {
      state.waitingForData = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
