import {
  SAVE_INCIDENT_SUCCESS,
  SAVE_INCIDENT_ERROR,
  CLEAR_INCIDENT,
  CLEAR_INCIDENT_MESSAGE,
  GET_INCIDENT_SUCCESS,
  GET_INCIDENT_ERROR,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case SAVE_INCIDENT_SUCCESS:
      return {
        ...state,
        incident: action.payload,
        error: null,
        loading: false,
        message: 'Incidencia enviada exitosamente',
      };
    case SAVE_INCIDENT_ERROR:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_INCIDENT:
      return {
        incidents: [],
        loading: true,
        incident: {},
        message: null,
        error: null,
      };
    case CLEAR_INCIDENT_MESSAGE:
      return {
        ...state,
        error: null,
        message: null,
      };
    case GET_INCIDENT_SUCCESS:
      return {
        ...state,
        incidents: action.payload,
        loading: false,
      };

    case GET_INCIDENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      break;
  }
};
