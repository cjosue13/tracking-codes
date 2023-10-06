/* eslint-disable no-useless-escape */
import React, { useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../auth/authContext';
import {
  CHANGE_ASSET_ERROR,
  CHANGE_ASSET_SUCCESS,
  CLEAR_ASSETS,
  CLEAR_ASSETS_MESSAGES,
  CLIENTS_ASSET_ERROR,
  CLIENTS_ASSET_SUCCESS,
  DELETE_ASSET_ERROR,
  DELETE_ASSET_SUCCESS,
  DISABLE_ASSET_ERROR,
  DISABLE_ASSET_SUCCESS,
  GET_ASSETS_ERROR,
  GET_ASSETS_SUCCESS,
  SAVE_ASSET_ERROR,
  SAVE_ASSET_SUCCESS,
  UPDATE_ASSET_ERROR,
  UPDATE_ASSET_SUCCESS,
} from '../../types';
import Request from '../../config/axios';
import AssetContext from './assetContext';
import assetReducer from './assetReducer';
import RNFetchBlob from 'rn-fetch-blob';
import { BACKEND_URL } from '../../config/environment';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  assets: [],
  clients: [],
  loading: true,
  message: null,
  error: null,
};

const AssetState = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user?.access_token;

  const [state, dispatch] = useReducer(assetReducer, initialState);

  const getAssets = async () => {
    try {
      const res = await Request.get(`/assets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: GET_ASSETS_SUCCESS,
        payload: res.data.assets,
      });
    } catch (error) {
      dispatch({
        type: GET_ASSETS_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo los activos',
      });
    }
  };

  const getClients = async () => {
    try {
      const res = await Request.get(`/client/getClients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: CLIENTS_ASSET_SUCCESS,
        payload: res.data.clients,
      });
    } catch (error) {
      dispatch({
        type: CLIENTS_ASSET_ERROR,
        payload: error?.message || 'Ha ocurrido un error obteniendo los clientes',
      });
    }
  };

  const disable = async (id, data) => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      const formData = [
        { name: 'disable', data: data.disable },
        { name: 'name', data: data.name },
        { name: 'serial', data: data.serial },
        { name: data.color === '' ? '' : 'color', data: data.color },
        { name: data.description === '' ? '' : 'description', data: data.description },
        { name: data.admission_date === '' ? '' : 'admissionDate', data: data.admission_date },
        {
          name: data.person_in_charge === '' ? '' : 'personInCharge',
          data: data.person_in_charge,
        },
        { name: data.remove_date === '' ? '' : 'removeDate', data: data.remove_date },
      ];

      if (data.file && data.file?.filename) {
        formData.push({
          name: 'file',
          filename: data.file.filename,
          type: data.file.type,
          data:
            Platform.OS === 'ios'
              ? 'RNFetchBlob-file://' +
                decodeURI(data.file.uri.replace('file:///', '').replace('file://', ''))
              : RNFetchBlob.wrap(data.file.uri),
        });
      }

      await RNFetchBlob.fetch(
        'POST',
        BACKEND_URL + `/assets/disable/${id}`,
        {
          Authorization: `Bearer ${user.access_token}`,
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        formData
      );

      console.log(formData);

      dispatch({
        type: DISABLE_ASSET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DISABLE_ASSET_ERROR,
        payload: error?.response?.data?.message,
      });
    }
  };

  const changeClient = async (id, data) => {
    try {
      await Request.put(`/assets/changeClient/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: CHANGE_ASSET_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: CHANGE_ASSET_ERROR,
        payload: error?.message || 'Ha ocurrido un error cambiando el activo de cliente',
      });
    }
  };

  const deleteAsset = async (id) => {
    try {
      const res = await Request.delete(`/assets/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: DELETE_ASSET_SUCCESS,
        payload: res.data.assets,
      });
    } catch (error) {
      dispatch({
        type: DELETE_ASSET_ERROR,
        payload: error?.message || 'Ha ocurrido un error eliminando el activo',
      });
    }
  };

  const store = async (data) => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      const formData = [
        { name: 'name', data: data.name },
        { name: 'serial', data: data.serial },
        { name: data.color === '' ? '' : 'color', data: data.color },
        { name: data.description === '' ? '' : 'description', data: data.description },
        { name: data.admission_date === '' ? '' : 'admissionDate', data: data.admission_date },
        {
          name: data.person_in_charge === '' ? '' : 'personInCharge',
          data: data.person_in_charge,
        },
      ];

      if (data.file && data.file?.filename) {
        formData.push({
          name: 'file',
          filename: data.file.filename,
          type: data.file.type,
          data:
            Platform.OS === 'ios'
              ? 'RNFetchBlob-file://' +
                decodeURI(data.file.uri.replace('file:///', '').replace('file://', ''))
              : RNFetchBlob.wrap(data.file.uri),
        });
      }

      await RNFetchBlob.fetch(
        'POST',
        BACKEND_URL + `/assets/store`,
        {
          Authorization: `Bearer ${user.access_token}`,
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        formData
      );

      dispatch({
        type: SAVE_ASSET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_ASSET_ERROR,
        payload: error?.response?.data?.message,
      });
    }
  };

  const update = async (id, data) => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      const formData = [
        { name: 'name', data: data.name },
        { name: 'serial', data: data.serial },
        { name: data.color === '' ? '' : 'color', data: data.color },
        { name: data.description === '' ? '' : 'description', data: data.description },
        {
          name: data.person_in_charge === '' ? '' : 'personInCharge',
          data: data.person_in_charge,
        },
      ];

      if (data.file && data.file?.filename) {
        formData.push({
          name: 'file',
          filename: data.file.filename,
          type: data.file.type,
          data:
            Platform.OS === 'ios'
              ? 'RNFetchBlob-file://' +
                decodeURI(data.file.uri.replace('file:///', '').replace('file://', ''))
              : RNFetchBlob.wrap(data.file.uri),
        });
      }

      await RNFetchBlob.fetch(
        'POST',
        BACKEND_URL + `/assets/update/${id}`,
        {
          Authorization: `Bearer ${user.access_token}`,
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        formData
      );

      dispatch({
        type: UPDATE_ASSET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_ASSET_ERROR,
        payload: error?.response?.data?.message,
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_ASSETS,
    });
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_ASSETS_MESSAGES,
    });
  };

  return (
    <AssetContext.Provider
      value={{
        assets: state.assets,
        loading: state.loading,
        message: state.message,
        error: state.error,
        clients: state.clients,
        getAssets,
        getClients,
        store,
        update,
        changeClient,
        disable,
        deleteAsset,
        clear,
        clearMessages,
      }}
    >
      {props.children}
    </AssetContext.Provider>
  );
};

AssetState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AssetState;
