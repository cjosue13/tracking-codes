import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';

const Item = ({ item, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('detail-supervysor', { item })}>
      <View style={styles.cardStyle}>
        <Text style={styles.title}>Creador:</Text>
        <Text style={styles.value}>{`${item.user.name} ${item.user.lastname}`}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.info}>Realizado el {item.created_at}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

Item.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
