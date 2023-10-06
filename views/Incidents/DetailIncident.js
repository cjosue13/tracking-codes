import { StyleSheet, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import globalStyles from '../../styles/global';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ModalComponent from '../../components/ui/partials/Modal';
import { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors } from '../../styles/colors';

const DetailIncident = ({ route }) => {
  const { item } = route.params;
  const [visible, setVisible] = useState(false);

  const [image, setImage] = useState('');

  const showModal = (url) => {
    setImage(url);
    setVisible(true);
  };
  const hideModal = () => {
    setImage('');
    setVisible(false);
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.secondaryContainer}>
        <ScrollView style={styles.listItem}>
          {item.title && (
            <>
              <Text style={styles.title}>Título:</Text>
              <Text style={styles.text}>{item.title}</Text>
            </>
          )}
          <Text style={styles.title}>Observación:</Text>
          <Text style={styles.text}>{item.observation}</Text>
          <Text style={styles.title}>Nombre de guarda:</Text>
          <Text style={styles.text}>{item.user_name}</Text>
          <Text style={styles.title}>Creado por: </Text>
          <Text style={styles.text}>{`${item.user.name} ${item.user.lastname}`}</Text>

          <ScrollView horizontal style={styles.imageContainer}>
            {item.images.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => showModal(item.url)}
                style={index !== 0 ? styles.imageMargin : {}}
              >
                <Image source={{ uri: item.url }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.textDate}>Realizada el {item.created_at}</Text>
        </ScrollView>
      </View>

      <ModalComponent visible={visible} hideModal={hideModal}>
        {image.trim() !== '' && (
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            style={styles.viewImage}
            source={{ uri: image }}
          />
        )}
      </ModalComponent>
    </View>
  );
};

export default DetailIncident;

DetailIncident.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  image: { borderRadius: RFValue(7), height: RFValue(120), width: RFValue(120) },
  imageContainer: { alignSelf: 'center', flex: 0, margin: '2.5%' },
  imageMargin: { marginLeft: RFValue(5) },
  listItem: {
    backgroundColor: colors.white,
    borderRadius: RFValue(5),
    elevation: 5,
    margin: '2.5%',
    padding: RFValue(10),
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  secondaryContainer: {
    alignSelf: 'center',
    flex: 0,
    height: '90%',
    margin: '5%',
    width: '95%',
  },
  text: {
    fontSize: RFValue(16),
    marginHorizontal: '2.5%',
  },
  textDate: {
    color: colors.inactive,
    fontSize: RFValue(18),
    margin: '2.5%',
    textAlign: 'right',
  },
  title: { fontSize: RFValue(18), fontWeight: 'bold' },
  viewImage: {
    alignSelf: 'center',
    height: RFValue(280),
    width: RFValue(280),
  },
});
