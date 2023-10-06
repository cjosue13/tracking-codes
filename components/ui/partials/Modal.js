import * as React from 'react';
import { Modal, Portal, Provider } from 'react-native-paper';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const ModalComponent = ({ visible, hideModal = () => {}, children }) => {
  return (
    <Provider>
      <Portal>
        <Modal
          style={styles.container}
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          {children}
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { margin: '5%' },
  containerStyle: { backgroundColor: colors.accent, padding: RFValue(20) },
});

ModalComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  hideModal: PropTypes.func,
};

export default ModalComponent;
