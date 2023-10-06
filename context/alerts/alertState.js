import React, { useReducer } from 'react';
import { CLEAR_ALERT, SEND_ALERT_ERROR, SEND_ALERT_SUCCESS } from '../../types';
import Request from '../../config/axios';
import PropTypes from 'prop-types';
import alertReducer from './alertReducer';
import AlertContext from './alertContext';
import { useContext } from 'react';
import AuthContext from '../auth/authContext';

const initialState = {
  message: null,
  error: null,
};

const AlertState = (props) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const store = async (data) => {
    try {
      const res = await Request.post('/alerts/store', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: SEND_ALERT_SUCCESS,
        payload: res.data.message,
      });
    } catch (error) {
      dispatch({
        type: SEND_ALERT_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error enviando la alerta.',
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_ALERT,
    });
  };

  return (
    <AlertContext.Provider
      value={{
        message: state.message,
        error: state.error,
        store,
        clear,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

AlertState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AlertState;
