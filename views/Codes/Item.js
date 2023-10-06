import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

const Item = ({ item }) => {
  return (
    <View style={styles.cardStyle}>
      <Text style={styles.title}>{item.mark.name}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.info}>Realizada el {item.created_at}</Text>
      </View>
    </View>
  );
};

export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
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
  info: {
    color: colors.info,
    fontSize: RFValue(14),
  },
  rightContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: RFValue(20) },
  title: {
    fontSize: RFValue(20),
  },
});
