import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { ActivityIndicator, Avatar, Button, Text, TextInput } from 'react-native-paper';
import globalStyles, { theme } from '../../styles/global';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { customStyles, height } from '../../utils/utils';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import ReportContext from '../../context/reports/reportContext';
import { size } from 'lodash';
import { Loading } from '../../components/ui/partials/Loading';
import { messageView } from '../../utils/message';

const Map = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStart] = useState('');
  const [items, setItems] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034,
  });

  const reportContext = useContext(ReportContext);

  const {
    getReportIndividual,
    marksIndividual,
    clearMessages,
    message,
    loadingMap,
    users,
    getUsers,
  } = reportContext;

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onCancel = () => {
    setShowDatePicker(false);
  };

  const onConfirm = (date) => {
    setShowDatePicker(false);
    setStart(moment(date).format('YYYY/MM/DD'));
  };

  const validations = () => {
    if (startDate.trim() !== '' && value) {
      submmit();
    } else {
      messageView('Debes seleccionar la fecha de inicio y seleccionar un usuario', 'warning', 3000);
    }
  };

  const submmit = async () => {
    setLoading(true);
    try {
      await getReportIndividual({ user: value, userDate: startDate });
    } catch (error) {
      messageView('Ha ocurrido un error generando el reporte', 'warning', 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (message) {
      messageView(message, 'success', 3000);
      clearMessages();
    }
  }, [message]);

  useEffect(() => {
    if (loadingMap) {
      getUsers();
    }
  }, [loadingMap]);

  useEffect(() => {
    if (size(users) > 0) {
      setItems(
        users.map((item) => ({
          label: item.name + ' ' + item.lastname,
          value: item.id,
          role: item.roles[0].name,
        }))
      );
    } else {
      setItems([]);
    }
  }, [users]);

  useEffect(() => {
    if (size(marksIndividual) > 0) {
      const position = JSON.parse(marksIndividual[0].position);
      setRegion({
        ...region,
        latitude: parseFloat(position.Latitud),
        longitude: parseFloat(position.Longitud),
      });
      setMarkers(
        marksIndividual.map((item) => {
          const position = JSON.parse(item.position);
          return {
            position: {
              latitude: parseFloat(position.Latitud),
              longitude: parseFloat(position.Longitud),
            },
            status: parseInt(item.status),
            hour: moment(item.created_at).format('hh:mm:ss a'),
          };
        })
      );
    } else {
      setMarkers([]);
    }
  }, [marksIndividual]);

  const colorPin = (item) => {
    if (item.status === -1) {
      return colors.before;
    } else if (item.status === 0) {
      return colors.into;
    } else if (item.status === 1) {
      return colors.after;
    } else {
      return colors.normalPin;
    }
  };

  const findRole = () => {
    const user = items.find((user) => user.value === value);
    return user?.role === 'Oficial de Seguridad'
      ? require('../../assets/images/guard.png')
      : require('../../assets/images/admin.png');
  };

  return (
    <View style={loadingMap ? styles.heightLoading : {}}>
      <Loading isVisible={loading} text="Generando reporte" />
      {loadingMap ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={styles.dropDown}
            dropDownContainerStyle={styles.containerDropdown}
            placeholder="Selecciona un colaborador"
            placeholderStyle={{ fontSize: RFValue(14) }}
            labelStyle={{ fontSize: RFValue(14) }}
          />
          <TouchableOpacity
            activeOpaticy={1}
            onPress={openDatePicker}
            style={styles.inputContainer}
          >
            <TextInput
              placeholder="Fecha de inicio"
              label="Fecha de inicio"
              value={startDate}
              editable={false}
              theme={theme}
              style={globalStyles.input}
              right={
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <FontAwesome size={size} color={color} name={'calendar'} solid />
                  )}
                  size={RFValue(16)}
                  disabled={true}
                  color={colors.primary}
                />
              }
            />
          </TouchableOpacity>

          <Button style={styles.button} uppercase={false} onPress={validations}>
            <Text style={styles.textButton}>Consultar</Text>
          </Button>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            zoomEnabled
            customMapStyle={customStyles}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.position}
                pinColor={colorPin(marker)}
                minZoomLevel={0}
                maxZoomLevel={15}
                onPress={() => messageView(`Hora de marca: ${marker.hour}`, 'info', 3000)}
              >
                <Avatar.Image
                  size={RFValue(35)}
                  source={findRole()}
                  style={{ backgroundColor: colorPin(marker) }}
                />
              </Marker>
            ))}
          </MapView>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={onConfirm}
            onCancel={onCancel}
            locale="es_Es"
            cancelTextIOS="Cancelar"
            confirmTextIOS="Confirmar"
            headerTextIOS="Elige una fecha"
          />
        </View>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary },
  containerDropdown: { borderWidth: 0 },
  dropDown: { borderRadius: 0, borderWidth: 0, marginTop: '2.5%' },
  heightLoading: { height: '81.25%' },
  inputContainer: { marginVertical: '2.5%' },
  map: {
    alignItems: 'flex-end',
    height: height,
    marginTop: '2.5%',
    position: 'relative',
  },
  textButton: { color: colors.white, fontSize: RFValue(16) },
});
