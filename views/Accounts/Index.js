import { FlatList, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import globalStyles from '../../styles/global';
import { Text } from 'react-native-paper';
import { size } from 'lodash';
import Item from './Item';
import AuthContext from '../../context/auth/authContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { messageView } from '../../utils/message';
import PropTypes from 'prop-types';

const Account = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { user, logOut, error, message, clearMessages } = authContext;
  const [loading, setLoading] = useState(false);

  const isActive = () => {
    const client = user.clients.find((client) => user.selected_client === client.id);
    return client.status !== 0;
  };

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

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clearMessages();
      if (isActive()) {
        navigation.navigate('tab-code');
      } else {
        messageView('El cliente ha sido desactivado', 'warning', 3000);
      }
    }
  }, [error, message]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.secondaryContainer}>
        {size(user?.clients) > 0 ? (
          <>
            <Text style={globalStyles.title}>Seleccione la cuenta que desea gestionar</Text>
            <FlatList
              data={user.clients}
              style={styles.list}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Item item={item} />}
            />
          </>
        ) : (
          <Text style={globalStyles.title}>No hay cuentas asignadas para este usuario</Text>
        )}
      </View>
    </View>
  );
};

Account.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flex: 1,
    marginBottom: 10,
  },
});

export default Account;
