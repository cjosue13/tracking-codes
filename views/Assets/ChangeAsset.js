import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import ModalComponent from '../../components/ui/partials/Modal';
import AssetContext from '../../context/assets/assetContext';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../../styles/colors';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import globalStyles from '../../styles/global';
import PropTypes from 'prop-types';

const ChangeAsset = ({ visible, hideModal, setClient, validations }) => {
  const assetContext = useContext(AssetContext);
  const { clients } = assetContext;
  return (
    <ModalComponent visible={visible} hideModal={hideModal}>
      <View>
        <Text style={globalStyles.title}>Listado de clientes</Text>
        <RNPickerSelect
          onValueChange={(value) => setClient(value)}
          items={
            clients.length === 0
              ? []
              : clients?.map((item) => ({ label: item.name, value: item.id }))
          }
          useNativeAndroidPickerStyle
          style={{
            inputIOS: { color: colors.white, backgroundColor: colors.whiteOpacity, height: RFValue(50)},
            inputAndroid: { color: colors.white, backgroundColor: colors.whiteOpacity },
            placeholder: { color: colors.white, backgroundColor: colors.whiteOpacity },
          }}
        />
        <Button
          style={styles.button}
          uppercase={false}
          color={colors.primary}
          onPress={() => validations()}
        >
          <Text style={styles.textButton}>Enviar activo</Text>
        </Button>
      </View>
    </ModalComponent>
  );
};

export default ChangeAsset;

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, marginTop: '2.5%' },
  textButton: { color: colors.white, fontSize: RFValue(16) },
});

ChangeAsset.propTypes = {
  visible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  setClient: PropTypes.func.isRequired,
  validations: PropTypes.func.isRequired,
};
