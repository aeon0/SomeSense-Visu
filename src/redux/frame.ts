import { createAction, createReducer } from '@reduxjs/toolkit'
import { Frame } from '../com/interface/proto/frame'
import { saveCurrMetaData } from '../util/save_protobuf'
import { convertImg } from '../util/img_data'


interface ImgContainer {
  key: string, // To be able to map it the a specific camSensor in the Frame data
  img: ImageData,
  semsegImg: ImageData,
  depthImg: ImageData,
}

export interface IReduxFrame {
  isSaving: boolean,
  fileName: string,
  data: Frame;
  displayImgs: ImgContainer[],
  storage: Frame[],
}

const initialState: IReduxFrame = {
  isSaving: false,
  fileName: "",
  data: null,
  displayImgs: [],
  storage: [],
}

export const setData = createAction<Frame>('frame/setData');
export const setSaveToFile = createAction<[boolean, string]>('frame/setSaveToFile');

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setData, (state, action) => {
      state.data = action.payload;
      
      // Convert all the Images to ImageData
      state.displayImgs = []; // reset
      for (let i = 0; i < (state.data.camSensors.length); ++i) {
        let camSensor = state.data.camSensors[i];
        state.displayImgs.push({
          key: state.data.camSensors[i].key,
          img: convertImg(camSensor.img),
          semsegImg: convertImg(camSensor.semsegImg),
          depthImg: convertImg(camSensor.depthImg),
        });
        if (camSensor.img) camSensor.img.data = null;
        if (camSensor.semsegImg) camSensor.semsegImg.data = null;
        if (camSensor.depthImg) camSensor.depthImg.data = null;
        if (camSensor.semsegRaw) camSensor.semsegRaw.data = null;
        if (camSensor.depthRaw) camSensor.depthRaw.data = null;
      }

      // Save in storage
      state.storage.push(state.data);
      if (state.storage.length >= 30) {
        state.storage.shift();
      }
    })
    .addCase(setSaveToFile, (state, action) => {
      if (state.isSaving && !action.payload[0]) {
        saveCurrMetaData(state.fileName);
      }
      state.isSaving = action.payload[0];
      state.fileName = action.payload[1];
    })
    .addDefaultCase((state, _) => state)
});
