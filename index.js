/**
 * @format
 */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AppRegistry, AppState } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { viewNotification } from './utils/utils';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function () {
    //AsyncStorage.setItem('firebase_token', token.token );
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    /*if (AppState.currentState === 'active') {
      const { title, message } = notification;
      viewNotification(title, message);
    } */
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function () {},

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function () {},

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  requestPermissions: true,
});

PushNotification.createChannel({
  channelId: 'VikingozTracking_id', // (required)
  channelName: 'VikingozTracking', // (required)
  channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
  playSound: false, // (optional) default: true
  soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
  // importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
});

export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    return fcmToken;
  } else {
    return null;
  }
};

messaging().setBackgroundMessageHandler(async () => {
  //console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async ({ notification }) => {
  if (AppState.currentState === 'active') {
    const { title, body } = notification;  
    viewNotification(title, body);
  }
});

AppRegistry.registerComponent(appName, () => App);
