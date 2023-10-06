import { StyleSheet, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import download from '../../utils/download';
import { AWS_URL } from '../../config/environment';

const Item = ({ item }) => {
  return (
    <TouchableOpacity onPress={() => download(AWS_URL + item.path)}>
      <View style={styles.cardStyle}>
        {item.title && (
          <>
            <Text style={styles.title}>Título:</Text>
            <Text style={styles.value}>{item.title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
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
