/* eslint-disable no-useless-escape */
import React, { useReducer } from 'react';
import authReducer from './authReducer';
import {
  CLEAR_LOGIN,
  CLEAR_MESSAGES,
  LOGIN_ERROR,
  LOGIN_EXPIRED_SESSION,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_ERROR,
  SAVE_ACCOUNT_ERROR,
  SAVE_ACCOUNT_SUCCESS,
  SAVE_PROFILE_ERROR,
  SAVE_PROFILE_SUCCESS,
} from '../../types';
import AuthContext from './authContext';
import Request from '../../config/axios';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../config/environment';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { clearStorage } from '../../utils/utils';
import { messageView } from '../../utils/message';

const initialState = {
  user: null,
  loading: false,
  message: null,
  error: null,
  expiredMessage: null,
};

const AuthState = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logIn = async (data, clearForm) => {
    const formData = [
      { name: 'email', data: data.email },
      { name: 'password', data: data.password },
    ];

    if (data.file) {
      formData.push({
        name: 'file',
        filename: decodeURI(data.file.replace(/^.*[\\\/]/, '')),
        type: 'image/jpeg',
        data:
          Platform.OS === 'ios'
            ? 'RNFetchBlob-file://' +
              decodeURI(data.file.replace('file:///', '').replace('file://', ''))
            : RNFetchBlob.wrap(data.file),
      });
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/login',
      { 'Content-Type': 'multipart/form-data' },
      formData
    )
      .then((resp) => {
        const data = JSON.parse(resp.data);
        const { user, access_token, message } = data;

        if (message) {
          dispatch({
            type: LOGIN_ERROR,
            payload: message,
          });
        } else {
          //Clear form of login
          clearForm();

          if (user.account.status !== 0 && user.roles[0].name !== 'Deshabilitado') {
            dispatch({
              type: LOGIN_SUCCESS,
              payload: { ...user, access_token },
            });
          } else if (user.roles[0].name === 'Deshabilitado') {
            messageView('Tu usuario ha sido deshabilitado', 'warning', 3000);
            clearStorage();
          } else {
            messageView('Tu cuenta ha sido desactivada', 'warning', 3000);
            clearStorage();
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_ERROR,
          payload: error?.response?.data?.message || 'Ha ocurrido un error inciando sesión.',
        });
      });
  };

  const saveError = async (error) => {
    clearStorage();
    try {
      await Request.post(
        '/users/error',
        { error },
        {
          timeout: 15000,
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUser = async () => {
    try {
      const storageUser = await AsyncStorage.getItem('user');

      const user = JSON.parse(storageUser);

      const res = await Request.get('/getClients', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
        timeout: 15000,
      });

      if (res.data.user.account.status !== 0 && res.data.user.roles[0].name !== 'Deshabilitado') {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { ...res.data.user, access_token: user.access_token },
        });
      } else if (res.data.user.roles[0].name === 'Deshabilitado') {
        messageView('Tu usuario ha sido deshabilitado', 'warning', 3000);
        clearStorage();
      } else {
        messageView('Tu cuenta ha sido desactivada', 'warning', 3000);
        clearStorage();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch({
          type: LOGIN_EXPIRED_SESSION,
        });
      } else {
        dispatch({
          type: LOGIN_ERROR,
          payload: error?.message || 'Ha ocurrido un error obteniendo el usuario',
        });
      }
    }
  };

  const logOut = async () => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      await Request.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
          timeout: 15000,
        }
      );
      dispatch({
        type: LOGOUT,
      });
    } catch (error) {
      dispatch({
        type: LOGOUT_ERROR,
        payload: error?.message || 'Ha ocurrido un error cerrando sesión',
      });
    }
  };

  const selectClient = async (id) => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      await Request.post(
        `/setClient/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
          timeout: 15000,
        }
      );
      dispatch({
        type: SAVE_ACCOUNT_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: SAVE_ACCOUNT_ERROR,
        payload: error?.message || 'Ha ocurrido un error cambiando de cuenta',
      });
    }
  };

  const updateProfile = async (data) => {
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storageUser);

      const formData = [
        { name: 'name', data: data.name },
        { name: 'email', data: data.email },
        { name: 'lastname', data: data.lastname },
        {
          name: data.password !== '' ? 'password' : '',
          data: data.password,
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
        BACKEND_URL + `/users/profile/`,
        {
          Authorization: `Bearer ${user.access_token}`,
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        formData
      );

      dispatch({
        type: SAVE_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_PROFILE_ERROR,
        payload: error?.response?.data?.message,
      });
    }
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_MESSAGES,
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_LOGIN,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        message: state.message,
        error: state.error,
        loading: state.loading,
        expiredMessage: state.expiredMessage,
        logIn,
        logOut,
        getUser,
        selectClient,
        updateProfile,
        clear,
        clearMessages,
        saveError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

AuthState.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AuthState;
