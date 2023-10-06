import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../../../styles/global';

const FieldError = (errors, field) => {
  if (errors[field]) {
    return (
      <HelperText theme={theme} style={styles.field} type="error" visible={true}>
        {errors[field][0]}
      </HelperText>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  field: {
    fontSize: RFValue(9),
    marginTop: 0,
  },
});

export default FieldError;
