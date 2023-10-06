import { StyleSheet, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

const Item = ({ item, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('detailIncident', { item })}>
      <View style={styles.cardStyle}>
        {item.title && (
          <>
            <Text style={styles.title}>Título:</Text>
            <Text style={styles.value}>{item.title}</Text>
          </>
        )}
        <Text style={styles.title}>Nombre de usuario:</Text>
        <Text style={styles.value}>{item.user_name}</Text>
        <Text style={styles.title}>Nombre de cliente:</Text>
        <Text style={styles.value}>{item.client.name}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.info}>Realizada el {item.created_at}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

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
  info: {
    color: colors.info,
    fontSize: RFValue(14),
  },
  rightContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: RFValue(20) },
  title: {
    color: colors.black,
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginTop: '2.5%',
    textAlign: 'left',
  },
  value: {
    fontSize: RFValue(14),
    marginLeft: '2.5%',
  },
});
