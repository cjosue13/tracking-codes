import { SEND_ALERT_SUCCESS, SEND_ALERT_ERROR, CLEAR_ALERT } from '../../types';

export default (state, action) => {
  switch (action.type) {
    case SEND_ALERT_SUCCESS:
      return {
        error: null,
        message: action.payload,
      };
    case SEND_ALERT_ERROR:
      return {
        loading: false,
        message: null,
        error: action.payload,
      };
    case CLEAR_ALERT:
      return {
        message: null,
        error: null,
      };

    default:
      break;
  }
};
