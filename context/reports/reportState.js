import React, { useContext, useReducer } from 'react';
import Request from '../../config/axios';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
import ReportContext from './reportContext';
import reportReducer from './reportReducer';

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

const initialState = {
  marks: {},
  marksIndividual: {},
  users: [],
  message: null,
  error: null,
  loading: true,
  loadingMap: true,
};

const ReportState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const [state, dispatch] = useReducer(reportReducer, initialState);

  const getReportDate = async (data, id) => {
    try {
      const res = await Request.post(`/reports/performance/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_REPORT_DATE_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_REPORT_DATE_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo el reporte',
      });
    }
  };

  const getReportIndividual = async (data) => {
    try {
      const res = await Request.post('/reports/individualTrack', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_REPORT_INDIVIDUAL_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_REPORT_INDIVIDUAL_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo el reporte',
      });
    }
  };

  const getUsers = async () => {
    try {
      const res = await Request.get('/reports/getUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      const result = Object.keys(res.data.users).map((key) => res.data.users[key]);

      dispatch({
        type: GET_USERS_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: GET_USERS_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo los usuarios',
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_REPORT,
    });
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_REPORT_MESSAGES,
    });
  };

  const clearIndividualReport = () => {
    dispatch({
      type: CLEAR_INDIVIDUAL_REPORT,
    });
  };

  return (
    <ReportContext.Provider
      value={{
        marks: state.marks,
        marksIndividual: state.marksIndividual,
        users: state.users,
        message: state.message,
        error: state.error,
        loading: state.loading,
        loadingMap: state.loadingMap,
        getReportDate,
        getReportIndividual,
        getUsers,
        clearMessages,
        clear,
        clearIndividualReport,
      }}
    >
      {props.children}
    </ReportContext.Provider>
  );
};

ReportState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ReportState;
