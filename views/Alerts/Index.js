/* eslint-disable react-native/split-platform-components */
import { Image, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import globalStyles from '../../styles/global';
import { messageView } from '../../utils/message';
import { Loading } from '../../components/ui/partials/Loading';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AlertContext from '../../context/alerts/alertContext';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import { optionsLocation } from '../Codes/Register';
import AwesomeAlert from 'react-native-awesome-alerts';
import BackgroundTimer from 'react-native-background-timer';

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { store, clear, error, message } = alertContext;
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = useState('5 segundos restantes');
  const isFocused = useIsFocused();

  const [secondsLeft, setSecondsLeft] = useState(5);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    if (timerOn) startTimer();
    else {
      BackgroundTimer.stopBackgroundTimer();
      setShowAlert(false);
      setText('5 segundos restantes');
      setSecondsLeft(5);
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    setText(secondsLeft + ' segundos restantes');
    if (secondsLeft === 0) {
      BackgroundTimer.stopBackgroundTimer();
      setTimerOn(false);
      setShowAlert(false);
      setLoading(true);
      setText('5 segundos restantes');
      setSecondsLeft(5);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (loading) {
      getCoords();
    }
  }, [loading]);

  useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clear();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clear();
    }
  }, [error, message]);

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft((secs) => {
        const seconds = secs > 0 ? secs - 1 : 0;
        return seconds;
      });
    }, 1000);
  };

  const submit = async (coords) => {
    try {
      await store({
        position: JSON.stringify({ Latitud: coords.latitude, Longitud: coords.longitude }),
      });
    } catch (error) {
      await messageView(error, 'danger', 3000);
    }
  };

  const getCoords = async () => {
    try {
      if (Platform.OS !== 'android') {
        await positionLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permisos de ubicación',
            message: '¿Deseas habilitar los permisos de ubicación?',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await positionLocation();
        } else {
          setLoading(false);
          await messageView('Permisos de ubicación denegados', 'danger', 3000);
        }
      }
    } catch (error) {
      await messageView(error, 'danger', 3000);
      setLoading(false);
    }
  };

  const positionLocation = async () => {
    if (Platform.OS !== 'android') {
      await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(async (coords) => {
          await submit(coords);
          setLoading(false);
        })
        .catch(async (error) => {
          await messageView(error.message, 'danger', 3000);
          setLoading(false);
        });
    } else {
      await Geolocation.getCurrentPosition(
        async (position) => {
          const { coords } = position;
          await submit(coords);
          setLoading(false);
        },
        async (error) => {
          await messageView(error.message, 'danger', 3000);
          setLoading(false);
        },
        optionsLocation
      );
    }
  };

  return (
    <View style={globalStyles.container}>
      <Loading isVisible={loading} text="Enviando alerta" />
      <View style={globalStyles.secondaryContainer}>
        <View style={styles.center}>
          <View style={styles.cardStyle}>
            <Text style={globalStyles.title}>Toca el ícono para enviar la alerta</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowAlert(true);
                  setTimerOn(true);
                }}
              >
                <Image
                  style={styles.image}
                  source={require('../../assets/images/alert.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="¿Confirma el envío de alerta?"
          message={text}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancelar"
          confirmText="Aceptar"
          confirmButtonColor={colors.primary}
          cancelButtonColor={colors.cancelButton}
          cancelButtonTextStyle={styles.cancel}
          onCancelPressed={() => {
            setTimerOn(false);
          }}
          onConfirmPressed={() => {
            setTimerOn(false);
            setLoading(true);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cancel: { color: colors.black },
  cardStyle: {
    alignContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    elevation: 3,
    justifyContent: 'center',
    padding: RFValue(20),
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  center: { alignContent: 'center', flex: 1, justifyContent: 'center' },
  image: { backgroundColor: colors.white, height: RFValue(120), width: RFValue(120) },
  imageContainer: { alignItems: 'center', justifyContent: 'center', margin: '5%' },
});

export default Alerts;
