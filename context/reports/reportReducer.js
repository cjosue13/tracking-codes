import {
  GET_REPORT_DATE_SUCCESS,
  GET_REPORT_DATE_ERROR,
  GET_REPORT_INDIVIDUAL_SUCCESS,
  GET_REPORT_INDIVIDUAL_ERROR,
  CLEAR_REPORT,
  CLEAR_REPORT_MESSAGES,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  CLEAR_INDIVIDUAL_REPORT,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case GET_REPORT_DATE_SUCCESS:
      return {
        ...state,
        marks: action.payload,
        error: null,
        loading: false,
      };
    case GET_REPORT_DATE_ERROR:
      return {
        ...state,
        message: null,
        error: action.payload,
        loading: false,
      };

    case GET_USERS_SUCCESS:
      return { ...state, users: action.payload, loadingMap: false };
    case GET_USERS_ERROR:
      return { ...state, error: action.payload, message: null, loadingMap: false };

    case GET_REPORT_INDIVIDUAL_SUCCESS:
      return {
        ...state,
        marksIndividual: action.payload,
        loadingMap: false,
        message: 'Reporte generado exitosamente',
      };
    case GET_REPORT_INDIVIDUAL_ERROR:
      return { ...state, error: action.payload, message: null, loadingMap: false };
    case CLEAR_REPORT:
      return {
        marks: {},
        marksIndividual: {},
        users: [],
        message: null,
        error: null,
        loading: true,
        loadingMap: true,
      };

    case CLEAR_REPORT_MESSAGES:
      return {
        ...state,
        message: null,
        error: null,
      };

    case CLEAR_INDIVIDUAL_REPORT:
      return {
        ...state,
        marksIndividual: {},
        users: [],
        message: null,
        error: null,
        loadingMap: true,
      };
    default:
      break;
  }
};
