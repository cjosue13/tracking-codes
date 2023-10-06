/* eslint-disable react-native/split-platform-components */
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../../styles/global';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { Loading } from '../../components/ui/partials/Loading';
import MarkContext from '../../context/mark/markContext';
import { useContext } from 'react';
import { messageView } from '../../utils/message';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import { isPointWithinRadius } from 'geolib';
import AuthContext from '../../context/auth/authContext';
import Geocoder from 'react-native-geocoding';
import { size } from 'lodash';
import ModalComponent from '../../components/ui/partials/Modal';
import Map from './Map';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

Geocoder.init('AIzaSyBCyVwskyC8saLCxTP8_VyJmZG7D9WCJqc', { language: 'es-MX' });

export const optionsLocation = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const Register = ({ navigation, route }) => {
  const id = route.params.id;
  const markContext = useContext(MarkContext);
  const {
    store,
    error,
    clearMessages,
    message,
    loading: start,
    getMark,
    mark,
    failedRange,
  } = markContext;
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerOn, setTimerOn] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = async (position) => {
    await setLocation(position);
    await setVisible(true);
  };

  const hideModal = () => {
    setLocation(null);
    setVisible(false);
  };
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (isFocused) {
      startModule();
    }
  }, [isFocused]);

  const startModule = async () => {
    await getMark(id);
    if (user?.roles[0]?.name !== 'Administrador') {
      setTimerOn(true);
    }
  };

  useEffect(() => {
    if (loading) {
      formSend();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 5000);
      clearMessages();
    }
    if (message) {
      setTimerOn(false);
      navigation.navigate('codes');
    }
  }, [error, message]);

  useEffect(() => {
    if (timerOn) startTimer();
    else {
      BackgroundTimer.stopBackgroundTimer();
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    if (secondsLeft === 0) {
      BackgroundTimer.stopBackgroundTimer();
      navigation.navigate('codes');
    }
  }, [secondsLeft]);

  const formSend = async () => {
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
          await validations(coords);
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
          await validations(coords);
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

  const validations = async (coords) => {
    const limitPoint = mark.position ? JSON.parse(mark.position) : null;
    if (user?.roles[0]?.name === 'Administrador') {
      await submit(coords, false);
    } else if (!limitPoint || (limitPoint && limitPoint.Longitud === '')) {
      await submit(coords, true);
    } else if (mark.position) {
      if (
        isPointWithinRadius(
          { latitude: coords.latitude, longitude: coords.longitude },
          {
            latitude: limitPoint.Latitud,
            longitude: limitPoint.Longitud,
          },
          mark.range ? mark.range : 50
        )
      ) {
        await submit(coords, true);
      } else {
        const memory = await DeviceInfo.getTotalDiskCapacity().then((totalMemory) => {
          let memory = totalMemory / 1024;
          memory /= 1024;
          memory /= 1024;
          return memory;
        });

        const data = {
          Longitud: coords.longitude,
          Latitud: coords.latitude,
          mark,
          client_id: mark.client_id,
          device_info: {
            avaibleMemory: memory + ' GB',
            systemName: DeviceInfo.getSystemName(),
            systemVersion: DeviceInfo.getSystemVersion(),
          },
          created_at: moment().format('YYYY/MM/DD HH:mm:ss'),
        };

        await failedRange(data);

        await messageView('El registro de lectura se encuentra fuera del rango', 'warning', 3000);
      }
    }
  };

  const submit = async (coords, confirm) => {
    await Geocoder.from({
      latitude: coords.latitude,
      longitude: coords.longitude,
    })
      .then(async (json) => {
        const addressComponent = json.results[0].address_components;
        let address = '';
        addressComponent.forEach((direction, index) => {
          address +=
            size(addressComponent) !== index + 1
              ? `${direction.long_name}, `
              : `${direction.long_name}.`;
        });

        if (user?.roles[0]?.name === 'Administrador' && !confirm) {
          await showModal(coords);
        } else {
          await store({ Longitud: coords.longitude, Latitud: coords.latitude }, { id, address });
        }
      })
      .catch(async () => {
        await messageView('Ha ocurrido un error generando la dirección', 'danger', 3000);
      });
  };

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft((secs) => {
        const seconds = secs > 0 ? secs - 1 : 0;
        return seconds;
      });
    }, 1000);
  };

  return (
    <View style={globalStyles.container}>
      {start || !mark ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={globalStyles.secondaryContainer}>
          <Text style={styles.title}>
            {user?.roles[0]?.name !== 'Administrador'
              ? 'Registrar marca'
              : 'Actualizar coordenadas'}
          </Text>
          <View style={styles.cardStyle}>
            <Text style={styles.header}>
              {user?.roles[0]?.name !== 'Administrador'
                ? 'Desea realizar la marca:'
                : 'Desea actualizar las coordenadas de:'}
            </Text>
            <Text style={styles.markName}>{mark?.name}</Text>

            {mark?.timeDescription !== '' && (
              <>
                <Text style={styles.subtitle}>Detalle:</Text>
                <Text style={styles.warning}>{mark?.timeDescription}</Text>
              </>
            )}

            <View style={styles.bottomContainer}>
              <Text style={styles.infoText}>
                {user?.roles[0]?.name !== 'Administrador'
                  ? 'Presione "Aceptar" para registrar su marca'
                  : 'Presione "Aceptar" para actualizar las coordenadas'}
              </Text>
              <Button
                uppercase={false}
                style={styles.button}
                color={colors.white}
                mode="outlined"
                onPress={() => setLoading(true)}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      {location && (
        <ModalComponent visible={visible} hideModal={hideModal}>
          <Map store={submit} data={location} />
        </ModalComponent>
      )}

      <Loading isVisible={loading} text="Registrando nueva marca" />
    </View>
  );
};

export default Register;

Register.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: RFValue(20),
    borderWidth: 1,
    color: colors.white,
    marginBottom: RFValue(20),
  },
  buttonText: {
    color: colors.white,
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  cardStyle: {
    alignContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    marginBottom: RFValue(15),
    marginLeft: RFValue(5),
    marginRight: RFValue(5),
    marginTop: RFValue(15),
    padding: RFValue(20),
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  header: { fontSize: RFValue(26), textAlign: 'center' },
  infoText: {
    color: colors.black,
    fontSize: RFValue(20),
    marginBottom: RFValue(20),
    textAlign: 'center',
  },
  markName: { fontSize: RFValue(26), fontStyle: 'italic', textAlign: 'center' },
  subtitle: {
    fontSize: RFValue(26),
    fontWeight: 'bold',
    marginTop: RFValue(20),
    textAlign: 'center',
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  warning: {
    color: colors.warning,
    fontSize: RFValue(26),
    textAlign: 'center',
  },
});
