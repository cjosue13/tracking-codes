import checkVersion from 'react-native-store-version';
import { version_app } from '../config/environment';

/* eslint-disable no-useless-escape */
export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const validateUpdate = async () => {
  return await checkVersion({
    version: version_app,
    iosStoreURL: 'https://apps.apple.com/us/app/vikingoz/id1640327216',
    androidStoreURL: 'https://play.google.com/store/apps/details?id=com.marks&hl=es-MX',
    country: 'us',
  });
};
