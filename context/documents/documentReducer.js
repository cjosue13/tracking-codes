import { CLEAR_DOCUMENTS, GET_DOCUMENTS_ERROR, GET_DOCUMENTS_SUCCESS } from '../../types';

export default (state, action) => {
  switch (action.type) {
    case GET_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload,
        error: null,
        loading: false,
      };
    case GET_DOCUMENTS_ERROR:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_DOCUMENTS:
      return {
        documents: [],
        loading: true,
        message: null,
        error: null,
      };

    default:
      break;
  }
};
