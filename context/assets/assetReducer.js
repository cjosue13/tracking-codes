import {
  CHANGE_ASSET_ERROR,
  CHANGE_ASSET_SUCCESS,
  CLEAR_ASSETS,
  CLEAR_ASSETS_MESSAGES,
  CLIENTS_ASSET_ERROR,
  CLIENTS_ASSET_SUCCESS,
  DELETE_ASSET_ERROR,
  DELETE_ASSET_SUCCESS,
  DISABLE_ASSET_ERROR,
  DISABLE_ASSET_SUCCESS,
  GET_ASSETS_ERROR,
  GET_ASSETS_SUCCESS,
  SAVE_ASSET_ERROR,
  SAVE_ASSET_SUCCESS,
  UPDATE_ASSET_ERROR,
  UPDATE_ASSET_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ASSETS_SUCCESS:
      return {
        ...state,
        assets: action.payload,
        loading: false,
      };
    case GET_ASSETS_ERROR:
      return {
        loading: false,
        error: action.payload,
        message: null,
      };
    case SAVE_ASSET_SUCCESS:
      return {
        ...state,
        loading: true,
        message: 'Activo creado exitosamente',
        error: null,
      };
    case UPDATE_ASSET_SUCCESS:
      return {
        ...state,
        loading: true,
        message: 'Activo actualizado exitosamente',
        error: null,
      };
    case UPDATE_ASSET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };
    case SAVE_ASSET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };
    case DISABLE_ASSET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };
    case DISABLE_ASSET_SUCCESS:
      return {
        ...state,
        loading: true,
        error: null,
        message: 'Se ha desactivado el activo correctamente',
      };

    case DELETE_ASSET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };
    case DELETE_ASSET_SUCCESS:
      return {
        ...state,
        loading: true,
        error: null,
        message: 'Se ha eliminado el activo correctamente',
      };

    case CHANGE_ASSET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };
    case CHANGE_ASSET_SUCCESS:
      return {
        ...state,
        loading: true,
        error: null,
        message: 'Se ha cambiado el activo de cliente correctamente',
      };

    case CLIENTS_ASSET_ERROR:
      return {
        ...state,
      };
    case CLIENTS_ASSET_SUCCESS:
      return {
        ...state,
        clients: action.payload,
      };

    case CLEAR_ASSETS:
      return {
        assets: [],
        loading: true,
        message: null,
        error: null,
        clients: [],
      };

    case CLEAR_ASSETS_MESSAGES:
      return {
        ...state,
        message: null,
        error: null,
      };

    default:
      break;
  }
};
