// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { messageView } from './message';

const getFileExtention = (fileUrl) => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

const download = async (url) => {
  const { config, fs } = RNFetchBlob;
  const date = new Date();
  let file_ext = getFileExtention(url);
  const appenExt = file_ext[0];
  file_ext = '.' + file_ext[0];
  let RootDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
  let options = {
    fileCache: false,
    path: RootDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
    appendExt: appenExt,
    addAndroidDownloads: {
      path: RootDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
      description: 'Descargando archivo...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,
    },
  };

  const download = async () => {
    messageView('Iniciando descarga', 'info', 3000);
    await config(options)
      .fetch('GET', encodeURI(url))
      .then(async (res) => {
        // Alert after successful downloading
        if (Platform.OS === 'ios') {
          try {
            // get the data
            let shareOptions = {
              url: res.data,
            };

            await Share.open(shareOptions)
              .then(() => {
                // toastRef.current.show('Acción realizada exitosamente.', 3000);
              })
              .catch(() => {
                // toastRef.current.show('No se ha realizado ninguna acción.', 3000);
              });
          } catch (error) {
            // toastRef.current.show('No se ha podido enviar el código QR.', 3000);
          }
          // RNFetchBlob.ios.openDocument(res.data);
        }

        messageView('Archivo descargado exitosamente', 'success', 3000);
      })
      .catch((error) => {
        messageView(error.Error, 'error', 3000);
      });
  };

  if (Platform.OS === 'ios') {
    await download();
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permisos de descarga',
        message:
          'La aplicación desea acceder a tu almacenamiento ' + 'para poder realizar descargas.',
        buttonNeutral: 'Preguntar más tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'De acuerdo',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await download();
    } else {
      messageView('Permiso de descarga denegado', 'warning', 3000);
    }
  }
};

export default download;
