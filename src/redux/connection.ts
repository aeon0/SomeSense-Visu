import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxConnection {
  topicPub: string;
  topicSub: string;
  waitingForData: boolean;
}

const initialState: IReduxConnection = {
  topicPub: "somesense_visu",
  topicSub: "somesense_app",
  waitingForData: true,
}

export const setTopicPub = createAction<string>('connection/setTopicPub')
export const setTopicSub = createAction<string>('connection/setTopicSub')
export const setWaitingForData = createAction<boolean>('connection/setWaitingForData')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setTopicPub, (state, action) => {
      state.topicPub = action.payload;
    })
    .addCase(setTopicSub, (state, action) => {
      state.topicSub = action.payload;
    })
    .addCase(setWaitingForData, (state, action) => {
      state.waitingForData = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
