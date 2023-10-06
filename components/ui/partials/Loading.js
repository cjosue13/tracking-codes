import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../styles/colors';
import { theme } from '../../../styles/global';
import PropTypes from 'prop-types';
import { Overlay } from '@rneui/base';

export const Loading = ({ isVisible, text }) => {
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor={theme.colors.primary}
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.view}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Overlay>
  );
};

Loading.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.white,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    height: RFValue(100),
    width: RFValue(200),
  },
  text: {
    color: theme.colors.primary,
    fontSize: RFValue(12),
    marginTop: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
