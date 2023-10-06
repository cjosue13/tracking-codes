import React, { useContext, useReducer } from 'react';

import MarkContext from './markContext';
import Request from '../../config/axios';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
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
import markReducer from './markReducer';

const initialState = {
  message: null,
  error: null,
  loading: true,
  marks: [],
  mark: null,
};

const MarkState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const token = user?.access_token;

  const [state, dispatch] = useReducer(markReducer, initialState);

  const store = async (position, data) => {
    try {
      const res = await Request.post(
        '/readings/store',
        {
          mark_id: data.id,
          location: JSON.stringify(position),
          address: data.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      dispatch({
        type: SAVE_MARKS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_MARKS_ERROR,
        payload:
          error?.response.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const failedRange = async (data) => {
    try {
      const res = await Request.post('/readings/failed', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: SAVE_MARKS_FAILED_RANGE,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_MARKS_FAILED_RANGE_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const getDayMarks = async () => {
    try {
      const res = await Request.get('/readings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_MARKS_SUCCESS,
        payload: res.data.readings,
      });
    } catch (error) {
      dispatch({
        type: GET_MARKS_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo las marcas',
      });
    }
  };

  const getMark = async (id) => {
    try {
      const res = await Request.get(`/readings/new/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_MARK_SUCCESS,
        payload: { ...res.data.mark, timeDescription: res.data.description },
      });
    } catch (error) {
      dispatch({
        type: GET_MARK_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo las marcas',
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_MARK,
    });
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_MARK_MESSAGES,
    });
  };

  return (
    <MarkContext.Provider
      value={{
        marks: state.marks,
        message: state.message,
        error: state.error,
        loading: state.loading,
        mark: state.mark,
        store,
        getDayMarks,
        getMark,
        clearMessages,
        clear,
        failedRange,
      }}
    >
      {props.children}
    </MarkContext.Provider>
  );
};

MarkState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default MarkState;
