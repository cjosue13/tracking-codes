import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import globalStyles from '../../styles/global';
import { ActivityIndicator, Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { Loading } from '../../components/ui/partials/Loading';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelInput from '../../components/ui/partials/LabelInput';
import Voice from '@react-native-voice/voice';
import { messageView } from '../../utils/message';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import SupervysorContext from '../../context/Supervysors/supervysorContext';
import { size } from 'lodash';
import PropTypes from 'prop-types';

const Register = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const supervysorContext = useContext(SupervysorContext);
  const {
    getForm,
    store,
    error,
    message,
    clear,
    clearMessages,
    loading: start,
    form,
  } = supervysorContext;

  const [itemsForm, setItemsForm] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getForm();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (form) {
      setFormData({ form: form.id, commentary: '', collaborator: '' });
    }
    if (size(form?.items) > 0) {
      setFormData({ form: form.id, commentary: '', collaborator: '' });
      setItemsForm(form.items.map((item) => ({ ...item, checked: 0, itemComment: '' })));
    }
  }, [form]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clear();
      navigation.navigate('supervysors');
    }
  }, [message, error]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const validations = () => {
    if (formData.collaborator.trim() !== '' && size(itemsForm) > 0) {
      onSubmit();
    } else if (formData.collaborator.trim() === '') {
      messageView('El campo de colaborador es requerido', 'warning', 3000);
    } else if (size(itemsForm) === 0) {
      messageView(
        'No hay lista de formularios disponible, por lo que no puedes guardar esta información',
        'warning',
        5000
      );
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await store({
        ...formData,
        item: itemsForm.map((item) => item.item),
        checked: itemsForm.map((item) => item.checked),
        itemComment: itemsForm.map((item) => item.itemComment),
      });
    } catch (error) {
      messageView('Ha ocurrido un error guardando el formulario', 'danger', 3000);
    }
    setLoading(false);
  };

  const onChange = (e, type) => {
    setFormData((item) => ({ ...item, [type]: e.nativeEvent.text }));
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

    setFormData((item) => ({ ...item, ['commentary']: result }));
  };

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

  useEffect(() => {
    if (!isFocused) {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [isFocused]);

  const changeForm = (index, value, type) => {
    setItemsForm(itemsForm.map((item, i) => (i !== index ? item : { ...item, [type]: value })));
  };

  return (
    <View style={globalStyles.container}>
      <Loading isVisible={loading} text="Guardando" />
      {start ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <KeyboardAwareScrollView>
            <View style={globalStyles.secondaryContainer}>
              <LabelInput field="Colaborador" required />
              <TextInput
                placeholder="Digita el nombre del colaborador"
                label="Colaborador"
                style={styles.input}
                value={formData.collaborator}
                onChange={(e) => onChange(e, 'collaborator')}
              />

              {size(itemsForm) > 0 && (
                <>
                  <LabelInput field="Preguntas generales" />
                  <View style={styles.containerQuestions}>
                    {itemsForm?.map((item, index) => (
                      <View key={index} style={styles.view}>
                        <Text style={styles.titleQuestion}>{item?.item}</Text>
                        <View style={styles.radioGroup}>
                          <View style={styles.radio}>
                            <RadioButton.Group
                              onValueChange={(value) => changeForm(index, value, 'checked')}
                              value={item.checked}
                            >
                              <RadioButton.Item
                                mode="android"
                                label="No"
                                value={0}
                                position="leading"
                                uncheckedColor={colors.primary}
                                color={colors.primary}
                              />
                              <RadioButton.Item
                                mode="android"
                                label="Si"
                                value={1}
                                position="leading"
                                uncheckedColor={colors.primary}
                                color={colors.primary}
                              />
                            </RadioButton.Group>
                          </View>
                          <View style={styles.rightContainer}>
                            <TextInput
                              placeholder="Digita un comentario"
                              label="Comentario"
                              multiline
                              numberOfLines={3}
                              style={styles.input}
                              value={item.itemComment}
                              onChange={(e) => changeForm(index, e.nativeEvent.text, 'itemComment')}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <LabelInput field="Comentarios adicionales" />
              <TextInput
                placeholder="Escribe un comentario o usa el ícono del micrófono para introducir texto por voz"
                label="Comentarios adicionales"
                multiline
                numberOfLines={6}
                style={styles.input}
                value={formData.commentary}
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
                onChange={(e) => onChange(e, 'commentary')}
              />
            </View>
          </KeyboardAwareScrollView>

          <Button uppercase={false} style={styles.button} onPress={validations}>
            <Text style={styles.label}>Guardar</Text>
          </Button>
        </>
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, bottom: 0, margin: '2.5%' },
  containerQuestions: {
    backgroundColor: colors.cancelButton,
    borderRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    margin: 10,
    padding: '2.5%',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  input: { ...globalStyles.input, marginTop: '2.5%' },
  label: { color: colors.header, fontSize: RFValue(20), fontWeight: 'bold' },
  radio: { alignItems: 'center', marginRight: '5%', width: '25%' },
  radioGroup: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  rightContainer: { width: '70%' },
  titleQuestion: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginBottom: '2.5%',
    textAlign: 'center',
  },
  view: { margin: '2.5%' },
});

Register.propTypes = {
  navigation: PropTypes.object.isRequired,
};
