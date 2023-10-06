import React, { useContext, useReducer } from 'react';
import Request from '../../config/axios';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
import supervysorReducer from './supervysorReducer';
import SupervysorContext from './supervysorContext';
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

const initialState = {
  supervysors: [],
  form: [],
  message: null,
  error: null,
  loading: true,
};

const SupervysorState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const [state, dispatch] = useReducer(supervysorReducer, initialState);

  const store = async (data) => {
    try {
      await Request.post(`/forms/store`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: SAVE_SUPERVYSOR_SUCCESS,
        payload: 'Formulario guardado exitosamente',
      });
    } catch (error) {
      dispatch({
        type: SAVE_SUPERVYSOR_ERROR,
        payload: error?.message || 'Ha ocurrido un error guardando el formulario',
      });
    }
  };

  const getSupervysors = async () => {
    try {
      const res = await Request.get('/forms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_SUPERVYSORS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_SUPERVYSORS_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo los formularios',
      });
    }
  };

  const getForm = async () => {
    try {
      const res = await Request.get('/forms/create', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_FORM_SUCCESS,
        payload: res.data?.form || {},
      });
    } catch (error) {
      dispatch({
        type: GET_FORM_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo el formulario',
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_SUPERVYSOR,
    });
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_SUPERVYSOR_MESSAGES,
    });
  };

  return (
    <SupervysorContext.Provider
      value={{
        supervysors: state.supervysors,
        message: state.message,
        error: state.error,
        loading: state.loading,
        form: state.form,
        store,
        getForm,
        getSupervysors,
        clearMessages,
        clear,
      }}
    >
      {props.children}
    </SupervysorContext.Provider>
  );
};

SupervysorState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default SupervysorState;
