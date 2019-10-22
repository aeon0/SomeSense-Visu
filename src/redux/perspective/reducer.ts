import { EReduxActionTypes } from "../action_types"

export enum EPerspectiveTypes {
  IMAGE_2D = '2D Image',
  FREE_3D = '3D Free',
  SIDE_3D = '3D Side',
  TOP_3D = '3D Top',
  FRONT_3D = '3D Front',
}

interface IReduxPerspective {
  type: EPerspectiveTypes;
}

const initialState: IReduxPerspective = {
  type: EPerspectiveTypes.IMAGE_2D,
}

export default function(state: IReduxPerspective = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.SET_PERSPECTIVE:
      return { ...state, type: action.perspective };
    default:
      return state;
  }
}
