import { StyleSheet, View } from 'react-native';
import React from 'react';
import globalStyles from '../../styles/global';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const ReplaceAsset = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.secondaryContainer}>
        <Text style={globalStyles.title}>Datos del reemplazo</Text>
        <ScrollView>
          <Text style={styles.title}>Nombre:</Text>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.title}>Número de serial:</Text>
          <Text style={styles.text}>{item.serial}</Text>
          <Text style={styles.title}>Color: </Text>
          <Text style={styles.text}>{item.color}</Text>
          <Text style={styles.title}>Fecha de ingreso a sitio: </Text>
          <Text style={styles.text}>{item.admission_date}</Text>
          <Text style={styles.title}>Encargado de llevar a sitio:</Text>
          <Text style={styles.text}>{item.person_in_charge}</Text>
          <Text style={styles.title}>Descripción:</Text>
          <Text style={styles.text}>{item.description}</Text>
          <Text style={styles.title}>Estado: </Text>
          <Text style={styles.text}>{item.status}</Text>
          <Text style={styles.title}>Fecha de baja en el sitio: </Text>
          <Text style={styles.text}>{item.remove_date}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReplaceAsset;

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(16),
    marginBottom: '2.5%',
  },
  title: { fontSize: RFValue(18), fontWeight: 'bold' },
});
ReplaceAsset.propTypes = {
  route: PropTypes.object.isRequired,
};
