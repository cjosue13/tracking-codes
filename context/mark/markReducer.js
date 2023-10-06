import {
  CLEAR_MARK,
  CLEAR_MARK_MESSAGES,
  GET_MARKS_ERROR,
  GET_MARKS_SUCCESS,
  GET_MARK_ERROR,
  GET_MARK_SUCCESS,
  SAVE_MARKS_ERROR,
  SAVE_MARKS_FAILED_RANGE,
  SAVE_MARKS_FAILED_RANGE_ERROR,
  SAVE_MARKS_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case SAVE_MARKS_SUCCESS:
      return {
        ...state,
        message: 'Marca registrada exitosamente',
        error: null,
      };

    case SAVE_MARKS_ERROR:
      return {
        ...state,
        message: null,
        error: action.payload,
      };

    case GET_MARKS_SUCCESS:
      return { ...state, marks: action.payload, loading: false };
    case GET_MARKS_ERROR:
      return { marks: [], error: action.payload, message: null, loading: false };
    case GET_MARK_SUCCESS:
      return { ...state, mark: action.payload, loading: false };
    case GET_MARK_ERROR:
      return { marks: [], error: action.payload, message: null, loading: false, mark: null };
    case SAVE_MARKS_FAILED_RANGE:
      return { ...state };
    case SAVE_MARKS_FAILED_RANGE_ERROR:
      return { ...state };

    case CLEAR_MARK:
      return {
        message: null,
        error: null,
        loading: true,
        marks: [],
        mark: null,
      };

    case CLEAR_MARK_MESSAGES:
      return {
        ...state,
        message: null,
        error: null,
      };
    default:
      break;
  }
};
