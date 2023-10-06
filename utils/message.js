import { showMessage } from 'react-native-flash-message';
export const messageView = (message, type, duration) => {
  showMessage({
    message,
    type,
    duration,
  });
};
