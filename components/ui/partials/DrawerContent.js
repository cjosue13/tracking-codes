import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Drawer, IconButton, Text } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../styles/colors';
import { messageView } from '../../../utils/message';
import AuthContext from '../../../context/auth/authContext';
import { Loading } from './Loading';
import globalStyles, { theme } from '../../../styles/global';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';

const DrawerContent = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { logOut, error, clearMessages, user } = authContext;
  const [loading, setLoading] = useState(false);
  const account = user.clients.find((client) => user.selected_client === client.id);

  useEffect(() => {
    if (loading) {
      signOut();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
  }, [error]);

  const signOut = async () => {
    try {
      await logOut();
    } catch (error) {
      messageView('Ha ocurrido un error cerrando sesión', 'danger', 3000);
    }
    setLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      <DrawerContentScrollView {...navigation} theme={theme}>
        <View style={styles.topContainer}>
          <IconButton
            icon={({ size, color }) => <FontAwesome size={size} color={color} name="user-edit" />}
            size={RFValue(20)}
            color={colors.primary}
            onPress={() => navigation.navigate('profile')}
          />
        </View>
        <View style={styles.imageContainer}>
          <Avatar.Image
            size={RFValue(60)}
            source={
              user.image ? { uri: user.image.url } : require('../../../assets/images/user.png')
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.accountTitle}>{account.name}</Text>
          <Text style={styles.text}>{`${user.name} ${user.lastname}`}</Text>
          <Text style={styles.text}>{user.email}</Text>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={{ backgroundColor: colors.primary, bottom: RFValue(-5) }}>
        <DrawerItem
          icon={({ size }) => (
            <Icon name="exit-to-app" color={colors.accent} size={RFValue(size)} />
          )}
          label="Salir"
          labelStyle={styles.label}
          onPress={() => {
            setLoading(true);
          }}
        />
      </Drawer.Section>

      <Loading isVisible={loading} text="Cerrando sesión." />
    </View>
  );
};

export default DrawerContent;

DrawerContent.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  accountTitle: { fontSize: RFValue(20), fontWeight: 'bold' },
  bottomContainer: { margin: '5%' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', margin: '5%' },
  label: {
    color: colors.accent,
    fontSize: RFValue(12),
  },
  text: { fontSize: RFValue(16), marginTop: RFValue(10) },
  topContainer: { alignItems: 'flex-end', justifyContent: 'flex-end' },
});
