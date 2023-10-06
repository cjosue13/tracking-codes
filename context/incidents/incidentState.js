/* eslint-disable no-useless-escape */
import React, { useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
import incidentReducer from './incidentReducer';
import {
  SAVE_INCIDENT_SUCCESS,
  SAVE_INCIDENT_ERROR,
  CLEAR_INCIDENT,
  CLEAR_INCIDENT_MESSAGE,
  GET_INCIDENT_ERROR,
  GET_INCIDENT_SUCCESS,
} from '../../types';
import { BACKEND_URL } from '../../config/environment';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import IncidentContext from './incidentContext';
import Request from '../../config/axios';

const initialState = {
  incidents: [],
  loading: true,
  incident: {},
  message: null,
  error: null,
};

const IncidentState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const [state, dispatch] = useReducer(incidentReducer, initialState);

  const store = async (data) => {
    const formData = [
      { name: 'observation', data: data.observation },
      { name: 'user_name', data: data.user_name },
      { name: 'title', data: data.title },
    ];

    data.file.forEach((file) =>
      formData.push({
        name: 'files[]',
        filename: decodeURI(file.replace(/^.*[\\\/]/, '')),
        type: 'image/jpeg',
        data:
          Platform.OS === 'ios'
            ? 'RNFetchBlob-file://' + decodeURI(file.replace('file:///', '').replace('file://', ''))
            : RNFetchBlob.wrap(file),
      })
    );

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/incidents/store',
      {
        Authorization: `Bearer ${token}`,
      },
      formData
    )
      .then((resp) => {
        const data = JSON.parse(resp.data);
        dispatch({
          type: SAVE_INCIDENT_SUCCESS,
          payload: data.incident,
        });
      })
      .catch(() => {
        dispatch({
          type: SAVE_INCIDENT_ERROR,
          payload: 'Ha ocurrido un error guardando la incidencia',
        });
      });
  };

  const getIncidents = async () => {
    try {
      const res = await Request.get(`/incidents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_INCIDENT_SUCCESS,
        payload: res.data.incidents,
      });
    } catch (error) {
      dispatch({
        type: GET_INCIDENT_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo las incidencias',
      });
    }
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_INCIDENT_MESSAGE,
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_INCIDENT,
    });
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents: state.incidents,
        loading: state.loading,
        incident: state.incident,
        message: state.message,
        error: state.error,
        store,
        getIncidents,
        clearMessages,
        clear,
      }}
    >
      {props.children}
    </IncidentContext.Provider>
  );
};

IncidentState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default IncidentState;
