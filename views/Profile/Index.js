import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
import globalStyles from '../../styles/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import AuthContext from '../../context/auth/authContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { messageView } from '../../utils/message';
import LabelInput from '../../components/ui/partials/LabelInput';
import { Loading } from '../../components/ui/partials/Loading';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const { user, updateProfile } = authContext;
  const initialState = {
    email: user.email,
    lastname: user.lastname,
    name: user.name,
    password: '',
    confirm_password: '',
  };

  const isFocused = useIsFocused();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(user.image ? { uri: user.image.url } : null);

  useEffect(() => {
    if (loading) {
      validations();
    }
  }, [loading]);

  useEffect(() => {
    setFormData({
      email: user.email,
      lastname: user.lastname,
      name: user.name,
      password: '',
      confirm_password: '',
    });

    setFile(user.image ? { uri: user.image.url } : null);
  }, [isFocused]);

  const formSend = async () => {
    try {
      await updateProfile({ ...formData, password: formData.password.trim(), file });
    } catch (error) {
      await messageView(error, 'danger', 3000);
    }
  };

  const validations = async () => {
    if (
      formData.name.trim() !== '' &&
      formData.lastname.trim() !== '' &&
      formData.email.trim() !== ''
    ) {
      if (
        (formData.password.trim() !== '' &&
          formData.password.trim() === formData.confirm_password.trim()) ||
        (formData.password.trim() === '' && formData.confirm_password.trim() === '')
      ) {
        await formSend();
      } else {
        await messageView('Las contraseñas no coinciden', 'warning', 3000);
      }
    } else {
      await messageView('Todos los campos del formulario son obligatorios', 'warning', 3000);
    }
    setLoading(false);
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
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

  return (
    <View style={globalStyles.container}>
      <Loading isVisible={loading} text="Actualizando perfil" />
      <View style={globalStyles.secondaryContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleGallery}>
            <Avatar.Image
              size={RFValue(60)}
              source={file ? file : require('../../assets/images/user.png')}
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
          <LabelInput field="Apellidos" required />
          <TextInput
            placeholder="Apellidos"
            label="Apellidos"
            style={styles.input}
            value={formData.lastname}
            onChange={(e) => onChange(e, 'lastname')}
          />
          <LabelInput field="Correo electrónico" required />
          <TextInput
            placeholder="Correo electrónico"
            label="Correo electrónico"
            style={styles.input}
            value={formData.email}
            onChange={(e) => onChange(e, 'email')}
          />
          <LabelInput field="Contraseña" />
          <TextInput
            placeholder="Contraseña"
            label="Contraseña"
            style={styles.input}
            value={formData.password}
            onChange={(e) => onChange(e, 'password')}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                onPress={() => setShowPassword((value) => !value)}
                icon={({ size, color }) => (
                  <FontAwesome
                    size={size}
                    color={color}
                    name={showPassword ? 'eye-slash' : 'eye'}
                  />
                )}
                size={RFValue(16)}
                color={colors.primary}
              />
            }
          />
          <LabelInput field="Confirmar contraseña" />
          <TextInput
            placeholder="Confirmar contraseña"
            label="Confirmar contraseña"
            style={styles.input}
            value={formData.confirm_password}
            onChange={(e) => onChange(e, 'confirm_password')}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                onPress={() => setShowPassword((value) => !value)}
                icon={({ size, color }) => (
                  <FontAwesome
                    size={size}
                    color={color}
                    name={showPassword ? 'eye-slash' : 'eye'}
                  />
                )}
                size={RFValue(16)}
                color={colors.primary}
              />
            }
          />
        </KeyboardAwareScrollView>
      </View>
      <Button
        uppercase={false}
        onPress={() => {
          setLoading(true);
        }}
        style={styles.button}
      >
        <Text style={styles.label}>Actualizar perfil</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, margin: '2.5%' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', margin: '5%' },
  input: { ...globalStyles.input, marginTop: '2.5%' },
  label: { color: colors.header, fontSize: RFValue(20), fontWeight: 'bold' },
  topContainer: { marginTop: '2.5%' },
});

export default Profile;
