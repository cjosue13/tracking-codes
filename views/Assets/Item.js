import { StyleSheet, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import { IconButton, Text } from 'react-native-paper';
import globalStyles from '../../styles/global';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

const Item = ({ item, navigation, showModal, onDelete }) => {
  const handleDelete = (id) => {
    Alert.alert('Información de activo', '¿Deseas eliminar el activo seleccionado?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Aceptar', onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View style={styles.cardStyle}>
      <View style={globalStyles.rowDirection}>
        <View style={styles.container}>
          <Text style={styles.title}>Activo:</Text>
          <Text style={styles.value}>{`${item.name}`}</Text>
          <Text style={styles.title}>Serial:</Text>
          <Text style={styles.value}>{`${item.serial}`}</Text>
          <Text style={styles.title}>Estado:</Text>
          <Text style={styles.value}>{item.status}</Text>
        </View>
        <View style={styles.viewButtons}>
          {item.status !== 'Inactivo' && (
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  style={styles.iosArrow}
                  name="square-edit-outline"
                  size={RFValue(25)}
                  color={colors.primary}
                />
              )}
              size={RFValue(25)}
              onPress={() => navigation.navigate('register-asset', { item })}
            />
          )}
          {item.status !== 'Activo' && item.replace && (
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  style={styles.iosArrow}
                  name="refresh"
                  size={RFValue(25)}
                  color={colors.primary}
                />
              )}
              size={RFValue(25)}
              onPress={() => navigation.navigate('replace-asset', { item: item.replace })}
            />
          )}

          {item.status !== 'Inactivo' && (
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  style={styles.iosArrow}
                  name="truck-cargo-container"
                  size={RFValue(25)}
                  color={colors.primary}
                />
              )}
              size={RFValue(25)}
              onPress={() => showModal(item.id)}
            />
          )}
          {item.status !== 'Inactivo' && (
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  style={styles.iosArrow}
                  name="circle-off-outline"
                  size={RFValue(25)}
                  color={colors.primary}
                />
              )}
              size={RFValue(25)}
              onPress={() => navigation.navigate('disable-asset', { item })}
            />
          )}
          {item.status !== 'Inactivo' && (
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  style={styles.iosArrow}
                  name="delete"
                  size={RFValue(25)}
                  color={colors.warning}
                />
              )}
              size={RFValue(25)}
              onPress={() => handleDelete(item.id)}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  cardStyle: {
    alignContent: 'center',
    backgroundColor: colors.white,
    borderRadius: RFValue(5),
    flex: 1,
    justifyContent: 'center',
    marginTop: '2.5%',
    padding: RFValue(20),
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: { alignItems: 'flex-start', flex: 1 },
  title: {
    color: colors.black,
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginTop: '2.5%',
    textAlign: 'left',
  },
  value: {
    fontSize: RFValue(14),
  },
  viewButtons: {
    justifyContent: 'center',
  },
});

Item.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
