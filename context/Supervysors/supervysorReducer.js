import {
  CLEAR_SUPERVYSOR,
  CLEAR_SUPERVYSOR_MESSAGES,
  GET_FORM_ERROR,
  GET_FORM_SUCCESS,
  GET_SUPERVYSORS_ERROR,
  GET_SUPERVYSORS_SUCCESS,
  SAVE_SUPERVYSOR_ERROR,
  SAVE_SUPERVYSOR_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SUPERVYSORS_SUCCESS:
      return {
        ...state,
        supervysors: action.payload,
        loading: false,
      };
    case GET_SUPERVYSORS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case SAVE_SUPERVYSOR_SUCCESS:
      return {
        ...state,
        message: action.payload,
      };
    case SAVE_SUPERVYSOR_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FORM_SUCCESS:
      return { ...state, form: action.payload, loading: false };
    case GET_FORM_ERROR:
      return { ...state, error: action.payload, loading: false };

    case CLEAR_SUPERVYSOR:
      return {
        supervysors: [],
        form: [],
        message: null,
        error: null,
        loading: true,
      };
    case CLEAR_SUPERVYSOR_MESSAGES:
      return { ...state, error: null, message: null };

    default:
      break;
  }
};
