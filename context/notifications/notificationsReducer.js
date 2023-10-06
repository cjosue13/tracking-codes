import {
  CLEAR_NOTIFICATIONS,
  LOAD_SUBSCRIPTION_ERROR,
  LOAD_SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_ERROR,
  SUBSCRIPTION_SUCCESS,
  UNSUBSCRIPTION_ERROR,
  UNSUBSCRIPTION_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        message: 'Se han activado las notificaciones.',
        loading: true,
        errror: null,
        success: true,
      };
    case SUBSCRIPTION_ERROR:
      return {
        ...state,
        error: 'Ha occurido un error en la subscripción.',
        message: null,
      };

    case UNSUBSCRIPTION_SUCCESS:
      return {
        ...state,
        success: true,
        message: 'Se han desactivado las notificaciones.',
        error: null,
        loading: true,
      };
    case UNSUBSCRIPTION_ERROR:
      return {
        ...state,
        message: null,
        error: 'Ha occurido un error en la subscripción.',
      };

    case LOAD_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        subscription: action.payload,
        message: null,
        error: null,
        loading: false,
        success: false
      };
    case LOAD_SUBSCRIPTION_ERROR:
      return {
        ...state,
        message: null,
        error: 'Ha occurido un error obteniendo la subscripción.',
      };

    case CLEAR_NOTIFICATIONS:
      return {
        loading: true,
        message: null,
        error: null,
        subscription: null,
        success: false,
      };
    default:
      break;
  }
};
