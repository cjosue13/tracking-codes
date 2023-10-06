import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import LabelInput from '../../components/ui/partials/LabelInput';
import globalStyles from '../../styles/global';
import { colors } from '../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFValue } from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import Voice from '@react-native-voice/voice';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { useState } from 'react';
import { Loading } from '../../components/ui/partials/Loading';
import { useContext } from 'react';
import { messageView } from '../../utils/message';
import { size } from 'lodash';
import IncidentContext from '../../context/incidents/incidentContext';
import AuthContext from '../../context/auth/authContext';

export const formIncident = {
  observation: '',
  user_name: '',
  title: '',
};

const Register = ({ setRegister, images, setImages, setFormData, formData, navigation }) => {
  const isFocused = useIsFocused();

  const [started, setStarted] = useState(false);
  const [text, setText] = useState('');

  const [loading, setLoading] = useState(false);

  const incidentContext = useContext(IncidentContext);
  const { store, message, error: errorMessage, clearMessages, clear } = incidentContext;

  const auth = useContext(AuthContext);
  const { user } = auth;

  useEffect(() => {
    if (errorMessage) {
      messageView(errorMessage, 'danger', 3000);
      clearMessages();
    }
    if (message) {
      messageView(message, 'success', 3000);
      if (user?.roles[0]?.name !== 'Oficial de Seguridad') {
        clear();
        navigation.navigate('incidents');
      } else {
        setFormData({ ...formIncident });
        setImages([]);
        setText('');
        clearMessages();
      }
    }
  }, [message, errorMessage]);

  const validations = () => {
    if (
      formData.user_name.trim() !== '' &&
      formData.observation.trim() !== '' &&
      formData.title.trim() !== ''
    ) {
      if (size(images) !== 0) {
        onSubmit();
      } else {
        messageView('Debes subir al menos 1 imagen', 'warning', 3000);
      }
    } else {
      messageView(
        'Los campos de título, nombre de oficial y descripción, son obligatorios',
        'warning',
        3000
      );
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await store({ ...formData, file: images });
    } catch (error) {
      messageView('Ha ocurrido un error enviando la incidencia', 'danger', 3000);
    }
    setLoading(false);
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSpeechStart = () => {
    setStarted(true);
  };

  const onSpeechEnd = () => {
    setStarted(false);
  };

  const onSpeechPartialResults = (e) => {
    let result = text;

    e?.value.forEach((value) => {
      result += value;
    });

    setText(result);

    setFormData((item) => ({ ...item, ['observation']: result }));
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechRecognizing = async () => {
    setStarted(false);
    try {
      await Voice.start('es-MX');
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
  };

  const stopSpeechRecognizing = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
  };

  const toggleListening = () => {
    try {
      if (started) {
        stopSpeechRecognizing();
      } else {
        startSpeechRecognizing();
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
  };

  const removeImage = (image) => {
    Alert.alert('Información de imagen', '¿Deseas eliminar la imagen seleccionada?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Aceptar', onPress: () => setImages(images.filter((item) => item !== image)) },
    ]);
  };

  useEffect(() => {
    if (!isFocused) {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [isFocused]);

  return (
    <>
      <Loading isVisible={loading} text="Enviando incidencia" />
      <Text style={styles.title}>Incidencias</Text>
      <KeyboardAwareScrollView>
        <View style={globalStyles.secondaryContainer}>
          <LabelInput field="Título" required />
          <TextInput
            placeholder="Título de incidencia"
            label="Título"
            style={styles.input}
            value={formData.title}
            onChange={(e) => onChange(e, 'title')}
          />
          <LabelInput field="Nombre de oficial" required />
          <TextInput
            placeholder="Nombre de oficial"
            label="Nombre de oficial"
            style={styles.input}
            value={formData.user_name}
            onChange={(e) => onChange(e, 'user_name')}
          />
          <LabelInput field="Descripción" required />
          <TextInput
            placeholder="Escribe un comentario o usa el ícono del micrófono para introducir texto por voz"
            label="Descripción"
            multiline
            numberOfLines={6}
            style={styles.input}
            value={formData.observation}
            right={
              <TextInput.Icon
                onPress={toggleListening}
                icon={({ size, color }) => (
                  <FontAwesome
                    size={size}
                    color={color}
                    name={started ? 'stop-circle' : 'microphone'}
                  />
                )}
                size={RFValue(16)}
                color={started ? 'red' : colors.primary}
              />
            }
            onChange={(e) => onChange(e, 'observation')}
          />
          <LabelInput field="Fotografías" required />
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome color={color} size={size} solid name="camera" />
            )}
            color={colors.primary}
            size={RFValue(45)}
            onPress={() => setRegister(false)}
            style={styles.capture}
          />
        </View>

        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeImage(item)}
              style={index !== 0 ? styles.imageMargin : {}}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAwareScrollView>

      <Button uppercase={false} style={styles.button} onPress={validations}>
        <Text style={styles.label}>Enviar incidencia</Text>
      </Button>
    </>
  );
};

export default Register;

Register.propTypes = {
  setRegister: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, bottom: 0, margin: '2.5%' },
  capture: {
    alignSelf: 'center',
    flex: 0,
    margin: '2.5%',
  },
  image: { borderRadius: RFValue(7), height: RFValue(80), width: RFValue(80) },
  imageContainer: { alignSelf: 'center', flex: 0 },
  imageMargin: { marginLeft: RFValue(5) },
  input: { ...globalStyles.input, marginTop: '2.5%' },
  label: { color: colors.header, fontSize: RFValue(20), fontWeight: 'bold' },
  title: {
    fontSize: RFValue(25),
    marginBottom: 0,
    marginTop: '5%',
    textAlign: 'center',
  },
});
