import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import { colors } from '../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import globalStyles from '../../styles/global';
import { chartInfo, height } from '../../utils/utils';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import ReportContext from '../../context/reports/reportContext';
import AuthContext from '../../context/auth/authContext';
import { Loading } from '../../components/ui/partials/Loading';
import { messageView } from '../../utils/message';
import { BarChart, Grid } from 'react-native-svg-charts';
import { size } from 'lodash';

const BarChartComponent = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStart] = useState('');
  const [endDate, setEnd] = useState('');
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportContext = useContext(ReportContext);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const { getReportDate, marks } = reportContext;

  const [data, setData] = useState([]);

  useEffect(() => {
    const array = chartInfo(marks);
    setData(array.map((item) => item));
  }, [marks]);

  const validations = () => {
    if (startDate.trim() !== '' && endDate.trim() !== '') {
      submmit();
    } else {
      messageView('Debes seleccionar la fecha de inicio y final', 'warning', 3000);
    }
  };

  const submmit = async () => {
    setLoading(true);
    try {
      const id = user.selected_client;
      await getReportDate({ initialDate: startDate, finalDate: endDate }, id);
    } catch (error) {
      messageView('Ha ocurrido un error generando el reporte', 'danger', 3000);
    }
    setLoading(false);
  };

  const openDatePicker = (flag) => {
    setShowDatePicker(true);
    setFlag(flag);
  };

  const onCancel = () => {
    setShowDatePicker(false);
  };

  const onConfirm = (date) => {
    setShowDatePicker(false);

    flag ? setStart(moment(date).format('YYYY/MM/DD')) : setEnd(moment(date).format('YYYY/MM/DD'));
  };

  return (
    <View>
      <Loading isVisible={loading} text="Generando reporte" />
      <View style={styles.container}>
        {size(data) > 0 &&
          data.map((item, index) => (
            <View key={index} style={styles.labelContainer}>
              <View style={{ ...styles.labelColor, backgroundColor: item.svg.fill }}></View>
              <Text style={styles.labels}>{`${item.name}: ${item.value}`}</Text>
            </View>
          ))}

        <View style={styles.chart}>
          <BarChart
            style={styles.flex}
            data={data}
            contentInset={styles.contentChart}
            yAccessor={({ item }) => item.value}
            spacingInner={0.5}
          >
            <Grid />
          </BarChart>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.startInput}
          activeOpaticy={1}
          onPress={() => openDatePicker(true)}
        >
          <TextInput
            placeholder="Inicio"
            label="Inicio"
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

        <TouchableOpacity
          style={styles.endInput}
          activeOpaticy={1}
          onPress={() => openDatePicker(false)}
        >
          <TextInput
            placeholder="Final"
            label="Final"
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
      </View>
      <Button
        style={styles.button}
        uppercase={false}
        color={colors.primary}
        onPress={() => validations()}
      >
        <Text style={styles.textButton}>Consultar</Text>
      </Button>
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
  );
};

export default BarChartComponent;

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary },
  chart: {
    flexDirection: 'row',
    height: height,
    padding: '2.5%',
  },
  container: { backgroundColor: colors.white, borderRadius: RFValue(10), padding: '2.5%' },
  contentChart: { bottom: RFValue(30), top: RFValue(20) },
  endInput: {
    width: '48.75%',
  },
  flex: { flex: 1 },
  labelColor: { borderRadius: RFValue(5), height: RFValue(20), width: RFValue(20) },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: '2.5%',
  },
  labels: { fontSize: RFValue(14), marginLeft: '2.5%' },
  rowContainer: { flexDirection: 'row', marginVertical: '2.5%' },
  startInput: {
    marginRight: '2.5%',
    width: '48.75%',
  },
  textButton: { color: colors.white, fontSize: RFValue(16) },
});
