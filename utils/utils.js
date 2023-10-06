import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import PushNotification from 'react-native-push-notification';

export const update = () => {
  return Alert.alert(
    'Información de actualización',
    'Existe una actualización nueva disponible en tiendas. Por favor realiza la actualización correspondiente',
    [
      {
        text: 'Aceptar',
        onPress: () => {
          Linking.openURL(
            Platform.OS !== 'android'
              ? 'https://apps.apple.com/us/app/vikingoz/id1640327216'
              : 'https://play.google.com/store/apps/details?id=com.marks&hl=es-MX'
          );
        },
      },
    ]
  );
};

export const chartInfo = (mark) => {
  return [
    {
      value: mark.success,
      svg: {
        fill: colors.before,
      },
      name: 'Antes',
    },
    {
      value: mark.onTime,
      svg: {
        fill: colors.into,
      },
      name: 'Dentro del rango',
    },
    {
      value: mark.failed,
      svg: {
        fill: colors.after,
      },
      name: 'Después',
    },
  ];
};

const screenHeight = Dimensions.get('window').height;

export const height = (40 * screenHeight) / 100;

export const clearStorage = () => {
  AsyncStorage.getAllKeys().then(async (asyncStorageKeys) => {
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  });
};

export const customStyles = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

export const viewNotification = (title, message) => {
  PushNotification.localNotification({
    // Android Only Properties
    channelId: 'VikingozTracking_id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    channelName: 'VikingozTracking', // (required),
    title: title,
    message: message,
    allowWhileIdle: false,
    repeatTime: 1,
    smallIcon: 'ic_notification',
  });
};
