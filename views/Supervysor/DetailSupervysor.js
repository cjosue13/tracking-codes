import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';
import globalStyles from '../../styles/global';
import { colors } from '../../styles/colors';
import ChartItem from '../../components/ui/partials/ChartItem';
import moment from 'moment/moment';

const DetailSupervysor = ({ route }) => {
  const { item } = route.params;
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.secondaryContainer}>
        <View style={styles.container}>
          <Text style={styles.date}>{`Boleta º${item.id}`}</Text>
          <View style={styles.topContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.title}>Supervisor:</Text>
              <Text style={styles.info}>{`${item.user.name} ${item.user.lastname}`}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>Fecha:</Text>
              <Text style={styles.info}>{moment(item.created_at).format('DD/MM/YYYY')}</Text>
            </View>
          </View>

          <Text style={styles.title}>Cliente:</Text>
          <Text style={styles.info}>{item.client.name}</Text>
          <Text style={styles.title}>Colaborador:</Text>
          <Text style={styles.info}>{item.collaborator}</Text>
        </View>

        <ChartItem item={item} />
      </View>
    </View>
  );
};

export default DetailSupervysor;

const styles = StyleSheet.create({
  container: {
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
  date: {
    color: colors.warning,
    fontSize: RFValue(14),
    marginVertical: '1.25%',
    textAlign: 'right',
  },
  info: {
    fontSize: RFValue(14),
    marginVertical: '1.25%',
  },
  leftContainer: { width: '50%' },
  rightContainer: { alignItems: 'flex-end', width: '50%' },
  title: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginVertical: '1.25%',
  },
  topContainer: { flexDirection: 'row' },
});

DetailSupervysor.propTypes = {
  route: PropTypes.object.isRequired,
};
