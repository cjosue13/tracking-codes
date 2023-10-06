import React, { useContext, useReducer } from 'react';
import {
  CLEAR_NOTIFICATIONS,
  LOAD_SUBSCRIPTION_ERROR,
  LOAD_SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_ERROR,
  SUBSCRIPTION_SUCCESS,
  UNSUBSCRIPTION_ERROR,
  UNSUBSCRIPTION_SUCCESS,
} from '../../types';
import AuthContext from '../auth/authContext';
import NotificationsContext from './notificationsContext';
import NotificationsReducer from './notificationsReducer';
import { getFcmToken } from '../..';
import Request from '../../config/axios';

const notificationsState = (props) => {
  const initialState = {
    loading: true,
    message: null,
    error: null,
    subscription: null,
    success: false,
  };

  const [state, dispatch] = useReducer(NotificationsReducer, initialState);
  // authContext
  const auth = useContext(AuthContext);
  const { user } = auth;
  const token = user?.access_token;

  const subscribe = async () => {
    // const FCMToken = await AsyncStorage.getItem('firebase_token');

    try {
      const FCMToken = await getFcmToken();

      await Request.post(
        `/native-notifications/subscribe`,
        { auth_token: FCMToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      dispatch({
        type: SUBSCRIPTION_SUCCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_ERROR,
        payload: error.message,
      });
    }
  };

  const unsubscribe = async () => {
    try {
      const FCMToken = await getFcmToken();
      // const FCMToken = await AsyncStorage.getItem('firebase_token');
      await Request.delete(`/native-notifications/unsubscribe/` + FCMToken, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: UNSUBSCRIPTION_SUCCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: UNSUBSCRIPTION_ERROR,
        payload: null,
      });
    }
  };

  const loadSubscription = async () => {
    try {
      const FCMToken = await getFcmToken();
      const res = await Request.get('/native-notifications/' + FCMToken, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      dispatch({
        type: LOAD_SUBSCRIPTION_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_SUBSCRIPTION_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const clear = () => {
    dispatch({ type: CLEAR_NOTIFICATIONS, payload: null });
  };

  return (
    <NotificationsContext.Provider
      value={{
        message: state.message,
        loading: state.loading,
        error: state.error,
        subscription: state.subscription,
        success: state.success,
        loadSubscription,
        subscribe,
        unsubscribe,
        clear,
      }}
    >
      {props.children}
    </NotificationsContext.Provider>
  );
};

export default notificationsState;
