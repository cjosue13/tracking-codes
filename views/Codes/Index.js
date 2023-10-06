import { View, StyleSheet, FlatList } from 'react-native';
import React, { useState } from 'react';
import globalStyles from '../../styles/global';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { size } from 'lodash';
import Item from './Item';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles/colors';
import PropTypes from 'prop-types';
import { messageView } from '../../utils/message';
import { useEffect } from 'react';
import MarkContext from '../../context/mark/markContext';
import { useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../context/auth/authContext';
import { Loading } from '../../components/ui/partials/Loading';
import { BASE_URL } from '../../config/environment';

const Codes = ({ navigation }) => {
  const [flashMode, setFlashMode] = useState(false);
  const markContext = useContext(MarkContext);
  const { error, clear, message, marks, getDayMarks, loading: start } = markContext;
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  const aurhContext = useContext(AuthContext);
  const { user, logOut } = aurhContext;

  const account = user.clients.find((client) => user.selected_client === client.id);

  const onSuccess = (e) => {
    const data = e.data;
    if (
      data.includes(`${BASE_URL}/readings/new/`) ||
      data.includes(`${BASE_URL}/tracking/readings/new/`)
    ) {
      const text = data.includes(`${BASE_URL}/readings/new/`)
        ? data.replace(`${BASE_URL}/readings/new/`, '')
        : data.replace(`${BASE_URL}/tracking/readings/new/`, '');
      const id = parseInt(text);

      navigation.navigate('register', { id });
    } else {
      messageView('El código QR no es válido', 'danger', 3000);
    }
  };

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    if (!isFocused) {
      clear();
    } else {
      clear();
      getDayMarks();
    }
  }, [isFocused]);

  useEffect(() => {
    if (loading) {
      formSend();
    }
  }, [loading]);

  const formSend = async () => {
    try {
      await logOut();
    } catch (error) {
      await messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      {start ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={globalStyles.secondaryContainer}>
          <View style={styles.topContainer}>
            <QRCodeScanner
              onRead={onSuccess}
              flashMode={
                flashMode ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off
              }
              reactivate={true}
              reactivateTimeout={3000}
              cameraStyle={styles.cameraStyle}
            />
            <Button
              onPress={() => setFlashMode(!flashMode)}
              uppercase={false}
              style={styles.buttonContainer}
            >
              <Text style={styles.flashText}>
                {flashMode ? 'Desactivar Flash' : 'Activar Flash'}
              </Text>
              <Ionicons
                name={flashMode ? 'flash-off' : 'flash'}
                size={RFValue(20)}
                color={colors.white}
                solid={true}
              />
            </Button>
          </View>
          {user?.roles[0]?.name !== 'Administrador' &&
            (size(marks) > 0 ? (
              <View style={styles.bottomContainer}>
                <Text style={globalStyles.title}>Últimas 24 horas</Text>
                <FlatList
                  data={marks}
                  style={styles.list}
                  keyExtractor={(guest, index) => index.toString()}
                  renderItem={({ item }) => <Item item={item} />}
                />
              </View>
            ) : (
              <Text style={globalStyles.title}>No hay marcas registradas</Text>
            ))}
        </View>
      )}

      <View style={styles.button}>
        <Text style={styles.buttonText}>{account.name}</Text>
      </View>
      <Loading isVisible={loading} text="Cerrando sesión" />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    height: '55%',
  },
  button: {
    color: colors.white,
    marginBottom: RFValue(20),
    marginHorizontal: '2.5%',
    marginLeft: 20,
    marginRight: 20,
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    marginTop: '2.5%',
    width: '75%',
  },
  buttonText: {
    color: colors.black,
    fontSize: RFValue(20),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraStyle: {
    height: RFValue(150),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    width: RFValue(150),
  },
  flashText: {
    color: colors.header,
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  list: {
    height: '40%',
  },
  topContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '45%',
    justifyContent: 'center',
    position: 'relative',
  },
});

Codes.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default Codes;
