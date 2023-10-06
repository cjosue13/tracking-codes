import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import globalStyles from '../../styles/global';
import { ActivityIndicator, Text } from 'react-native-paper';
import ModalComponent from '../../components/ui/partials/Modal';
import { RFValue } from 'react-native-responsive-fontsize';
import BarChartComponent from './BarChart';
import Map from './Map';
import ReportContext from '../../context/reports/reportContext';
import { colors } from '../../styles/colors';
import { useIsFocused } from '@react-navigation/native';
import { messageView } from '../../utils/message';
import AuthContext from '../../context/auth/authContext';
import moment from 'moment';

const Report = () => {
  const reportContext = useContext(ReportContext);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const {
    loading: start,
    getReportDate,
    clear,
    error,
    clearMessages,
    clearIndividualReport,
  } = reportContext;
  const [visible, setVisible] = useState(false);
  const isFocused = useIsFocused();
  const showModal = () => setVisible(true);
  const hideModal = () => {
    clearIndividualReport();
    setVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      const startOfMonth = moment().startOf('month').format('YYYY/MM/DD');
      const today = moment().format('YYYY/MM/DD');
      const id = user.selected_client;
      getReportDate({ initialDate: startOfMonth, finalDate: today }, id);
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearMessages();
    }
  }, [error]);

  return (
    <View style={globalStyles.container}>
      {start ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={globalStyles.secondaryContainer}>
            <BarChartComponent />
            <TouchableOpacity style={styles.container} onPress={showModal}>
              <Text style={styles.text}>Ver reporte de colaboradores</Text>
            </TouchableOpacity>
          </View>
          <ModalComponent visible={visible} hideModal={hideModal}>
            <Map />
          </ModalComponent>
        </>
      )}
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    marginTop: '2.5%',
  },
  text: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
