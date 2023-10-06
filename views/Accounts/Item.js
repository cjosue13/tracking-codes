import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../styles/colors';
import { Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import AuthContext from '../../context/auth/authContext';

const Item = ({ item }) => {
  const authContext = useContext(AuthContext);
  const { selectClient, user } = authContext;

  return (
    <TouchableOpacity
      style={item.id !== user.selected_client ? styles.cardStyle : styles.cardSelected}
      onPress={() => selectClient(item.id)}
    >
      <Text style={item.id !== user.selected_client ? styles.text : styles.textSelected}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  cardSelected: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    elevation: 3,
    flex: 1,
    height: RFValue(65),
    justifyContent: 'center',
    marginBottom: RFValue(15),
    marginLeft: RFValue(5),
    marginRight: RFValue(5),
    marginTop: RFValue(15),
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardStyle: {
    alignContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    elevation: 3,
    flex: 1,
    height: RFValue(65),
    justifyContent: 'center',
    marginBottom: RFValue(15),
    marginLeft: RFValue(5),
    marginRight: RFValue(5),
    marginTop: RFValue(15),

    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    fontSize: RFValue(20),
    textAlign: 'center',
  },
  textSelected: {
    color: colors.white,
    fontSize: RFValue(20),
    textAlign: 'center',
  },
});
