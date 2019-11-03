import { EReduxActionTypes } from "../action_types"

export enum EPerspectiveTypes {
  IMAGE_2D = '2D Image',
  FREE_3D = '3D Free',
}

interface IReduxPerspective {
  type: EPerspectiveTypes;
}

const initialState: IReduxPerspective = {
  type: EPerspectiveTypes.FREE_3D,
}

export default function(state: IReduxPerspective = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.SET_PERSPECTIVE:
      return { ...state, type: action.perspective };
    default:
      return state;
  }
}
