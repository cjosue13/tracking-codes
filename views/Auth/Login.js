/* eslint-disable react-native/no-raw-text */
import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import globalStyles from '../../styles/global';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'react-native-paper';
import AuthContext from '../../context/auth/authContext';
import { isEmpty } from 'lodash';
import { validateUpdate } from '../../utils/validations';
import { Loading } from '../../components/ui/partials/Loading';
import { messageView } from '../../utils/message';
import { update } from '../../utils/utils';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

export const defaultValueLogin = {
  email: '',
  password: '',
};

const Login = ({ setCamera, setImages, images, formData, setFormData }) => {
  const authContext = useContext(AuthContext);
  const { logIn, error, message, expiredMessage, clear, saveError } = authContext;

  const [loading, setLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text.trim() });
  };

  const clearForm = () => {
    setImages([]);
    setFormData({ ...defaultValueLogin });
  };

  const onSubmit = async () => {
    try {
      const check = await validateUpdate();
      if (check.result === 'new') {
        update();
      } else if (isEmpty(formData.email.trim()) || isEmpty(formData.password.trim())) {
        messageView('Todos los campos son obligatorios', 'warning', 3000);
      } /*else if (!validateEmail(formData.email.trim())) {
      messageView('El correo electrónico no es correcto', 'warning', 3000);
    }*/ else {
        setLoading(true);
      }
    } catch (error) {
      saveError('REALIZANDO LOGIN: ' + error.message);
      messageView(
        `Ha ocurrido un error iniciando la aplicación :${error?.message}`,
        'danger',
        3000
      );
    }
  };

  useEffect(() => {
    if (loading) {
      formSend();
    }
  }, [loading]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardStatus(Platform.OS === 'android' ? 0 : event.endCoordinates.height - RFValue(20));
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const formSend = async () => {
    try {
      await logIn({ ...formData, file: images[0] }, clearForm);
    } catch (error) {
      await messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clear();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clear();
    }
    if (expiredMessage) {
      messageView(expiredMessage, 'warning', 5000);
      clear();
    }
  }, [error, message, expiredMessage]);

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.image}>
      <View style={[styles.container, { bottom: keyboardStatus }]}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor={colors.white}
          value={formData.email}
          onChange={(e) => onChange(e, 'email')}
          underlineColorAndroid={colors.transparent}
          selectionColor={colors.primary}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.white}
          underlineColor={colors.white}
          secureTextEntry={true}
          value={formData.password}
          onChange={(e) => onChange(e, 'password')}
          underlineColorAndroid={colors.transparent}
          selectionColor={colors.primary}
        />
        <Button
          labelStyle={styles.labelStyle}
          mode="outlined"
          onPress={() => setCamera(true)}
          uppercase={false}
          style={styles.capture}
          icon={({ size, color }) => <FontAwesome color={color} size={size} solid name="camera" />}
        >
          Agregar imagen
        </Button>
        <Button
          labelStyle={styles.labelStyleLogin}
          mode="outlined"
          onPress={() => onSubmit()}
          uppercase={false}
          style={styles.button}
        >
          Ingresar
        </Button>
      </View>
      <Loading isVisible={loading} text="Iniciando sesión" />
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.black,
    borderRadius: RFValue(20),
    borderWidth: 1,
    marginBottom: '2.5%',
  },
  capture: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderRadius: RFValue(20),
    borderWidth: 1,
    marginBottom: '2.5%',
  },
  container: {
    ...globalStyles.container,
    backgroundColor: colors.transparent,
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: '2.5%',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: colors.whiteOpacity,
    borderColor: colors.white,
    borderRadius: RFValue(20),
    borderWidth: 1,
    color: colors.white,
    fontSize: RFValue(20),
    height: RFValue(50),
    marginBottom: '2.5%',
    opacity: 80,
    paddingHorizontal: 15,
    paddingLeft: RFValue(30),
    paddingRight: RFValue(30),
  },
  labelStyle: { color: colors.primary, fontSize: RFValue(20) },
  labelStyleLogin: { color: colors.white, fontSize: RFValue(20) },
  logo: {
    height: RFValue(180),
    marginBottom: RFValue(25),
    resizeMode: 'contain',
    width: RFValue(320),
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: RFValue(20),
  },
});

Login.propTypes = {
  setCamera: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};
