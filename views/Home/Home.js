import React, { useContext, useEffect, useState } from 'react';
import Login, { defaultValueLogin } from '../Auth/Login';
import AuthContext from '../../context/auth/authContext';
import { NavigationContainer } from '@react-navigation/native';
import MenuStack from '../../components/navigations/Menu/MenuStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Loading } from '../../components/ui/partials/Loading';
import FlashMessage from 'react-native-flash-message';
import { theme } from '../../styles/global';
import { clearStorage, update } from '../../utils/utils';
import { validateUpdate } from '../../utils/validations';
import StartCamera from '../Auth/StartCamera';
import { messageView } from '../../utils/message';
import NetInfo from '@react-native-community/netinfo';
import { Text } from 'react-native-paper';
import ModalComponent from '../../components/ui/partials/Modal';
import { colors } from '../../styles/colors';

function Home() {
  const authContext = useContext(AuthContext);
  const { user, getUser, saveError } = authContext;
  const [loading, setLoading] = useState(true);
  const [camera, setCamera] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState(defaultValueLogin);
  const [isOffline, setOfflineStatus] = useState(false);

  const handleNetworkChange = (state) => {
    const offline = !(state.isConnected && state.isInternetReachable);
    setOfflineStatus(offline);
  };

  const loadUserData = async () => {
    try {
      const { result } = await validateUpdate();
      if (result === 'new') {
        await update();
      } else if (result === 'equal' || result === 'old') {
        if (!user) {
          const tokenAuth = await AsyncStorage.getItem('user');
          if (tokenAuth) {
            await getUser();
          } else {
            await clearStorage();
          }
        }
      }
    } catch (error) {
      saveError('INICIANDO APLICACIÓN: ' + error.message);
      messageView(
        `Ha ocurrido un error iniciando la aplicación :${error?.message}`,
        'danger',
        3000
      );
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    loadUserData();
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  if (loading) {
    return (
      <>
        <Loading isVisible={loading} text="Iniciando" />
      </>
    );
  }

  return (
    <>
      {Platform.OS !== 'android' && (
        <StatusBar backgroundColor={theme.colors.primary} barStyle="dark-content" />
      )}
      {!isOffline ? (
        <>
          {user !== null ? (
            <NavigationContainer>
              <MenuStack />
            </NavigationContainer>
          ) : (
            <>
              {!camera ? (
                <Login
                  formData={formData}
                  setFormData={setFormData}
                  setCamera={setCamera}
                  images={images}
                  setImages={setImages}
                />
              ) : (
                <StartCamera setCamera={setCamera} images={images} setImages={setImages} />
              )}
            </>
          )}
        </>
      ) : (
        <ModalComponent visible={isOffline}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Error de conexión</Text>
            <Text style={styles.modalText}>Oops! Tu dispositivo no está conectado a internet.</Text>
          </View>
        </ModalComponent>
      )}
      <FlashMessage position="top" />
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  modalText: {
    color: colors.modalText,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 14,
    textAlign: 'center',
  },
  modalTitle: {
    color: colors.black,
    fontSize: 22,
    fontWeight: '600',
  },
});

export default Home;
