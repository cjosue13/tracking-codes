/* eslint-disable no-useless-escape */
import React, { useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
import { CLEAR_DOCUMENTS, GET_DOCUMENTS_ERROR, GET_DOCUMENTS_SUCCESS } from '../../types';
import Request from '../../config/axios';
import DocumentContext from './documentContext';
import documentReducer from './documentReducer';

const initialState = {
  documents: [],
  loading: true,
  message: null,
  error: null,
};

const DocumentState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const [state, dispatch] = useReducer(documentReducer, initialState);

  const getDocuments = async () => {
    try {
      const res = await Request.get(`/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_DOCUMENTS_SUCCESS,
        payload: res.data.documents,
      });
    } catch (error) {
      dispatch({
        type: GET_DOCUMENTS_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo los documentos',
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_DOCUMENTS,
    });
  };

  return (
    <DocumentContext.Provider
      value={{
        documents: state.documents,
        loading: state.loading,
        message: state.message,
        error: state.error,
        getDocuments,
        clear,
      }}
    >
      {props.children}
    </DocumentContext.Provider>
  );
};

DocumentState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default DocumentState;
