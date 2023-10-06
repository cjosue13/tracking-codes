import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Avatar, Button, Text } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { customStyles, height } from '../../utils/utils';
import { colors } from '../../styles/colors';
import { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { messageView } from '../../utils/message';
import PropTypes from 'prop-types';
import { Loading } from '../../components/ui/partials/Loading';
import { useEffect } from 'react';

const Map = ({ data, store }) => {
  const [marker, setMarker] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
  });

  const [loading, setLoading] = useState(false);

  const [newMarker, setNewMarker] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
  });

  const [region, setregion] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034,
  });

  const handleNewLocation = () => {
    setMarker(newMarker);
    setregion({ ...region, latitude: newMarker.latitude, longitude: newMarker.longitude });
    messageView('Nueva ubicación asignada', 'success', 3000);
  };

  useEffect(() => {
    if (loading) {
      submit();
    }
  }, [loading]);

  const submit = async () => {
    try {
      await store(marker, true);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  return (
    <View>
      <Button
        style={styles.button}
        uppercase={false}
        color={colors.primary}
        onPress={handleNewLocation}
      >
        <Text style={styles.textButton}>Actualizar coordenadas</Text>
      </Button>
      <Button
        style={styles.buttonSuccess}
        uppercase={false}
        color={colors.primary}
        onPress={() => setLoading(true)}
      >
        <Text style={styles.textButtonSuccess}>Actualizar marca</Text>
      </Button>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        zoomEnabled
        region={region}
        customMapStyle={customStyles}
        showsUserLocation
        onUserLocationChange={(e) => {
          setNewMarker({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
      >
        <Marker
          draggable
          key={'mark'}
          coordinate={marker}
          pinColor={colors.white}
          minZoomLevel={0}
          maxZoomLevel={15}
          onDragEnd={(e) => {
            setMarker({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
            setregion({
              ...region,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          onPress={() =>
            messageView(`Latitud: ${marker.latitude}, Longitud: ${marker.longitude}`, 'info', 5000)
          }
        >
          <Avatar.Image
            style={styles.icon}
            size={RFValue(35)}
            source={require('../../assets/images/admin.png')}
          />
        </Marker>
      </MapView>

      <Loading isVisible={loading} text="Guardando nueva ubicación" />
    </View>
  );
};

export default Map;

Map.propTypes = {
  data: PropTypes.object.isRequired,
  store: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: { backgroundColor: colors.cancelButton, marginTop: '2.5%' },
  buttonSuccess: { backgroundColor: colors.primary, marginTop: '2.5%' },
  icon: { backgroundColor: colors.white },
  map: {
    alignItems: 'flex-end',
    height: height,
    marginTop: '2.5%',
    position: 'relative',
  },
  textButton: { color: colors.black, fontSize: RFValue(16) },
  textButtonSuccess: { color: colors.white, fontSize: RFValue(16) },
});
