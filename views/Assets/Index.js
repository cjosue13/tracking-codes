import { FlatList, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import globalStyles from '../../styles/global';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import { colors } from '../../styles/colors';
import PropTypes from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { size } from 'lodash';
import Item from './Item';
import AssetContext from '../../context/assets/assetContext';
import { useState } from 'react';
import { Loading } from '../../components/ui/partials/Loading';
import { messageView } from '../../utils/message';
import ChangeAsset from './ChangeAsset';

const Asset = ({ navigation }) => {
  const assetContext = useContext(AssetContext);
  const {
    changeClient,
    clear,
    getAssets,
    assets,
    loading: start,
    getClients,
    error,
    message,
    clearMessages,
    deleteAsset,
    //disable,
  } = assetContext;

  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  //const [inactivating, setInactivating] = useState(false);

  const showModal = (id) => {
    setValue(id);
    setVisible(true);
  };

  const hideModal = () => {
    setValue(null);
    setVisible(false);
    setClient(null);
  };

  useEffect(() => {
    if (!isFocused) {
      clear();
    } else {
      getClients();
      getAssets();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clearMessages();
    }
  }, [message, error]);

  const validations = () => {
    if (client) {
      onSubmit();
    } else {
      messageView('El campo de cliente es requerido', 'warning', 3000);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await changeClient(value, { client });
      getAssets();
    } catch (error) {
      messageView('Ha ocurrido un error guardando el formulario', 'danger', 3000);
    }
    hideModal();
    setLoading(false);
  };

  const onDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteAsset(id);
      getAssets();
    } catch (error) {
      messageView(error.message, 'danger', 3000);
    }
    setDeleting(false);
  };

  /*const onInactive = async (id) => {
    setInactivating(true);
    try {
      await disable(id);
      getAssets();
    } catch (error) {
      messageView(error.message, 'danger', 3000);
    }
    setInactivating(false);
  };*/

  return (
    <View style={globalStyles.container}>
      {start ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Loading isVisible={loading} text="Realizando envío" />
          <Loading isVisible={deleting} text="Eliminando activo" />

          <View style={globalStyles.secondaryContainer}>
            {size(assets) > 0 ? (
              <>
                <Text style={globalStyles.title}>Listado de activos</Text>
                <FlatList
                  data={assets}
                  style={globalStyles.flatList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Item
                      item={item}
                      navigation={navigation}
                      onDelete={onDelete}
                      showModal={showModal}
                    />
                  )}
                />
              </>
            ) : (
              <Text style={globalStyles.title}>No hay activos registrados</Text>
            )}

            <FAB
              icon="plus"
              color={colors.white}
              style={globalStyles.fabLeft}
              onPress={() => navigation.navigate('register-asset')}
            />
          </View>
        </>
      )}

      {visible && (
        <ChangeAsset
          visible={visible}
          hideModal={hideModal}
          setClient={setClient}
          validations={validations}
        />
      )}
    </View>
  );
};

Asset.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Asset;
