import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { RFValue } from 'react-native-responsive-fontsize';
import { size } from 'lodash';
import { messageView } from '../../utils/message';
import { colors } from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconButton } from 'react-native-paper';

const StartCamera = ({ setCamera, images, setImages }) => {
  const [flash, setFlash] = useState(false);
  let takePhoto = false;
  let camera = null;

  const takePicture = async () => {
    if (!takePhoto && camera && size(images) < 1) {
      takePhoto = true;
      const options = { quality: 0.5, base64: false };
      const data = await camera.takePictureAsync(options);
      setImages((items) => [...items, data.uri]);
      takePhoto = false;
    } else if (size(images) === 1) {
      messageView('Solo puedes tomar un máximo de 1 foto', 'warning', 3000);
    }
  };

  const removeImage = (image) => {
    Alert.alert('Información de imagen', '¿Deseas eliminar la imagen seleccionada?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Aceptar', onPress: () => setImages(images.filter((item) => item !== image)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={(ref) => {
          camera = ref;
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        flashMode={flash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />

      <View style={styles.flashContainer}>
        <IconButton
          icon={({ color, size }) => (
            <Ionicons
              color={color}
              size={size}
              solid
              name={flash ? 'flashlight' : 'flashlight-outline'}
            />
          )}
          color={colors.white}
          size={RFValue(35)}
          onPress={() => setFlash(!flash)}
          style={styles.light}
        />
      </View>

      <View style={styles.checkContainer}>
        <IconButton
          icon={({ color, size }) => (
            <Ionicons color={color} size={size} solid name={'checkmark-sharp'} />
          )}
          color={colors.white}
          size={RFValue(35)}
          onPress={() => setCamera(false)}
          style={styles.check}
        />
      </View>

      <View style={styles.cameraContainer}>
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeImage(item)}
              style={index !== 0 ? styles.imageMargin : {}}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <IconButton
          icon={({ color, size }) => <FontAwesome color={color} size={size} solid name="camera" />}
          color={colors.white}
          size={RFValue(45)}
          onPress={takePicture}
          style={styles.capture}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    bottom: 0,
    flex: 0,
    left: 0,
    margin: '2.5%',
    position: 'absolute',
    right: 0,
  },
  capture: {
    alignSelf: 'center',
    backgroundColor: colors.transparent,
    flex: 0,
    margin: '2.5%',
  },
  check: {
    alignSelf: 'flex-start',
    backgroundColor: colors.transparent,
    flex: 0,
    margin: '2.5%',
  },
  checkContainer: {
    flex: 0,
    left: 0,
    margin: '2.5%',
    position: 'absolute',
  },
  container: { height: '100%', width: '100%' },
  flashContainer: {
    flex: 0,
    margin: '2.5%',
    position: 'absolute',
    right: 0,
  },
  image: { borderRadius: RFValue(7), height: RFValue(80), width: RFValue(80) },
  imageContainer: { alignSelf: 'center', flex: 0 },
  imageMargin: { marginLeft: RFValue(5) },
  light: {
    alignSelf: 'flex-end',
    backgroundColor: colors.transparent,
    flex: 0,
    margin: '2.5%',
  },
  preview: {
    flex: 1,
  },
});

StartCamera.propTypes = {
  setCamera: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default StartCamera;
