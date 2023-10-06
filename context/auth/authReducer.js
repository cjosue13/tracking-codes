import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CLEAR_LOGIN,
  CLEAR_MESSAGES,
  LOGIN_ERROR,
  LOGIN_EXPIRED_SESSION,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_ERROR,
  SAVE_ACCOUNT_ERROR,
  SAVE_ACCOUNT_SUCCESS,
  SAVE_PROFILE_ERROR,
  SAVE_PROFILE_SUCCESS,
} from '../../types';
import { clearStorage } from '../../utils/utils';

export default (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      AsyncStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };

    case LOGIN_ERROR:
      clearStorage();
      return {
        user: null,
        loading: false,
        message: null,
        error: action.payload,
        expiredMessage: null,
      };

    case SAVE_ACCOUNT_SUCCESS:
      return {
        ...state,
        message: 'Se ha cambiado de cuenta exitosamente',
        error: null,
        loading: false,
        user: { ...state.user, selected_client: action.payload },
      };

    case SAVE_ACCOUNT_ERROR:
      return {
        ...state,
        message: null,
        error: action.payload,
        loading: false,
      };

    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        message: 'Se ha actualizado el perfil exitosamente',
        error: null,
        user: {
          ...state.user,
          name: action.payload.name,
          lastname: action.payload.lastname,
          email: action.payload.email,
          image: action.payload.file ? { url: action.payload.file.uri } : null,
        },
      };

    case SAVE_PROFILE_ERROR:
      return {
        ...state,
        message: null,
        error: action.payload,
      };

    case CLEAR_LOGIN:
      return {
        user: null,
        loading: false,
        message: null,
        error: null,
        expiredMessage: null,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        message: null,
        error: null,
        expiredMessage: null,
      };

    case LOGOUT:
      clearStorage();
      return {
        user: null,
        loading: false,
        message: 'Sesión cerrada exitosamente',
        error: null,
        expiredMessage: null,
      };
    case LOGOUT_ERROR:
      return {
        ...state,
        message: null,
        error: action.payload,
      };
    case LOGIN_EXPIRED_SESSION:
      //clearStorage();
      return {
        ...state,
        message: null,
        error: action.payload,
        expiredMessage:
          'Se ha detectado una sesión en otro dispositivo, si deseas ingresar nuevamente debes ingresar tus credenciales',
      };
    default:
      break;
  }
};
