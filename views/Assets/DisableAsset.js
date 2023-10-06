import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, RadioButton, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import LabelInput from '../../components/ui/partials/LabelInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableOpacity } from 'react-native';
import globalStyles from '../../styles/global';
import { Loading } from '../../components/ui/partials/Loading';
import { messageView } from '../../utils/message';
import { launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AssetContext from '../../context/assets/assetContext';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

const DisableAsset = ({ navigation, route }) => {
  const { item } = route.params;

  const initialState = {
    name: '',
    serial: '',
    color: '',
    description: '',
    admission_date: '',
    person_in_charge: '',
  };

  const assetContext = useContext(AssetContext);
  const { disable, message, error, clearMessages } = assetContext;

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStart] = useState( '');
  const [endDate, setEnd] = useState('');
  const [flag, setFlag] = useState(false);
  const [value, setValue] = useState('false');
  const [file, setFile] = useState(null);

  const openDatePicker = (flag) => {
    setShowDatePicker(true);
    setFlag(flag);
  };

  const onCancel = () => {
    setShowDatePicker(false);
  };

  const onConfirm = (date) => {
    setShowDatePicker(false);

    flag ? setStart(moment(date).format('YYYY-MM-DD')) : setEnd(moment(date).format('YYYY-MM-DD'));
  };

  const validations = async () => {
    if (
      (value !== 'true' && endDate.trim() !== '') ||
      (formData.name.trim() !== '' && formData.serial.trim() !== '')
    ) {
      await formSend();
    } else if (endDate.trim() === '') {
      await messageView('La fecha de salida es un campo obligatorio', 'warning', 3000);
    } else {
      await messageView('El nombre, el número de serie y son campos obligatorios', 'warning', 3000);
    }
  };

  const formSend = async () => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        disable: value,
        admission_date: startDate,
        remove_date: endDate,
        file,
      };

      await disable(item.id, data);
    } catch (error) {
      await messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  const handleGallery = async () => {
    const options = {};

    await launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        setFile({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          filename: response.assets[0].fileName,
          uri: response.assets[0].uri,
        });
      }
    });
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
    if (message) {
      setEnd('');
      messageView(message, 'success', 3000);
      navigation.navigate('assets');
    }
  }, [message, error]);

  return (
    <View style={globalStyles.container}>
      <Loading isVisible={loading} text="Deshabilitando activo" />
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
      <Text style={globalStyles.title}>{item.name}</Text>

      <ScrollView style={globalStyles.secondaryContainer}>
        <LabelInput field="Opciones de reemplazo" />

        <RadioButton.Group
          onValueChange={(newValue) => {
            setValue(newValue);
          }}
          style={styles.radioGroup}
          value={value}
        >
          <View style={styles.mainbox}>
            <RadioButton.Item
              value={'false'}
              mode="android"
              uncheckedColor={colors.white}
              color={colors.white}
              label={'Desactivar sin remplazo'}
              labelStyle={{ color: colors.white }}
            />
          </View>
          <View style={styles.mainbox}>
            <RadioButton.Item
              value={'true'}
              mode="android"
              uncheckedColor={colors.white}
              color={colors.white}
              label={'Desactivar con remplazo'}
              labelStyle={{ color: colors.white }}
            />
          </View>
        </RadioButton.Group>

        <LabelInput field="Fecha de salida en el sitio" />
        <TouchableOpacity
          style={styles.startInput}
          activeOpaticy={1}
          onPress={() => openDatePicker(false)}
        >
          <TextInput
            placeholder="Fecha"
            label="Fecha"
            value={endDate}
            editable={false}
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

        {value !== 'false' && (
          <>
            <Text style={globalStyles.title}>Nuevo activo</Text>

            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleGallery}>
                <Avatar.Image
                  size={RFValue(60)}
                  source={file ? file : require('../../assets/images/imagen.png')}
                />
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView style={styles.topContainer}>
              <LabelInput field="Nombre" required />
              <TextInput
                placeholder="Nombre"
                label="Nombre"
                style={styles.input}
                value={formData.name}
                onChange={(e) => onChange(e, 'name')}
              />
              <LabelInput field="Número de serie" required />
              <TextInput
                placeholder="Serie"
                label="Serie"
                style={styles.input}
                value={formData.serial}
                onChange={(e) => onChange(e, 'serial')}
              />
              <LabelInput field="Color" />
              <TextInput
                placeholder="Color"
                label="Color"
                style={styles.input}
                value={formData.color}
                onChange={(e) => onChange(e, 'color')}
              />
              <LabelInput field="Encargado de llevarlo a sitio" />
              <TextInput
                placeholder="Encargado"
                label="Encargado"
                style={styles.input}
                value={formData.person_in_charge}
                onChange={(e) => onChange(e, 'person_in_charge')}
              />

              <LabelInput field="Descripción" />
              <TextInput
                placeholder="Descripción"
                label="Descripción"
                style={styles.input}
                value={formData.description}
                multiline
                numberOfLines={6}
                onChange={(e) => onChange(e, 'description')}
              />
              <LabelInput field="Fecha de ingreso a sitio" />
              <TouchableOpacity
                style={styles.startInput}
                activeOpaticy={1}
                onPress={() => openDatePicker(true)}
              >
                <TextInput
                  placeholder="Fecha"
                  label="Fecha"
                  value={startDate}
                  editable={false}
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
            </KeyboardAwareScrollView>
          </>
        )}
      </ScrollView>
      <Button
        uppercase={false}
        onPress={() => {
          validations();
        }}
        style={styles.button}
      >
        <Text style={styles.label}>Deshabilitar activo</Text>
      </Button>
    </View>
  );
};

export default DisableAsset;
const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, margin: '2.5%' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', margin: '5%' },
  input: { ...globalStyles.input, marginTop: '2.5%' },
  label: { color: colors.header, fontSize: RFValue(20), fontWeight: 'bold' },
  mainbox: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: '2.5%',
    textAlign: 'center',
  },
  topContainer: { marginTop: '2.5%' },
});

DisableAsset.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
