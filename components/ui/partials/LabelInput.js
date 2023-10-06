import React from 'react';
import { HelperText, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../styles/colors';

const LabelInput = ({ field, required = false }) => {
  return (
    <Text style={styles.field}>
      {field}
      {required && (
        <HelperText style={styles.subInfo} type="error" visible>
          {` *`}
        </HelperText>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  field: {
    color: colors.black,
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginTop: '2.5%',
  },
  subInfo: {
    fontSize: RFValue(16),
  },
});

LabelInput.propTypes = {
  field: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default LabelInput;
