import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { colors } from '../../styles/colors';
import globalStyles from '../../styles/global';
import { RFValue } from 'react-native-responsive-fontsize';
import { Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';

const { height } = Dimensions.get('window');

const Index = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.secondaryContainer}>
        <Text style={styles.titleMain}>Tutoriales</Text>

        <TouchableOpacity
          style={styles.cardStyle}
          onPress={async () => {
            Linking.openURL(
              'https://drive.google.com/file/d/13YqJzS3bPCYdUWGQEXVEnZECP4MuasTu/view?usp=sharing'
            );
          }}
        >
          <Text style={styles.title}>Inicio de sesión</Text>
        </TouchableOpacity>

        {user?.roles[0]?.name === 'Administrador' && (
          <TouchableOpacity
            style={styles.cardStyle}
            onPress={async () => {
              Linking.openURL(
                'https://drive.google.com/file/d/1FpXI5gE1xo2yVkpw3HYyVWVwgoFRMSWS/view?usp=sharing'
              );
            }}
          >
            <Text style={styles.title}>Tutorial de administración</Text>
          </TouchableOpacity>
        )}

        {user?.roles[0]?.name === 'Oficial de Seguridad' && (
          <TouchableOpacity
            style={styles.cardStyle}
            onPress={async () => {
              Linking.openURL(
                'https://drive.google.com/file/d/1QrnOEo-rb3qXwGgv1fi6ivrrcfgKf5Vk/view?usp=sharing'
              );
            }}
          >
            <Text style={styles.title}>Tutorial de oficiales de seguridad</Text>
          </TouchableOpacity>
        )}

        {(user?.roles[0]?.name === 'Monitoreo' || user?.roles[0]?.name === 'Supervisor') && (
          <TouchableOpacity
            onPress={async () => {
              Linking.openURL(
                'https://drive.google.com/file/d/1iIHQK3RJ0Ygz6g0laMydRpqVUARtHxKN/view?usp=sharing'
              );
            }}
            style={styles.cardStyle}
          >
            <Text style={styles.title}>Tutorial de supervisores</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  cardStyle: {
    alignContent: 'center',
    backgroundColor: colors.white,
    borderRadius: RFValue(5),
    height: height / 4 - 100,
    justifyContent: 'center',
    marginTop: '2.5%',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  title: {
    backgroundColor: colors.red,
    color: colors.black,
    fontSize: RFValue(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleMain: {
    fontSize: RFValue(25),
    marginBottom: RFValue(30),
    marginTop: RFValue(50),
    textAlign: 'center',
  },
});
