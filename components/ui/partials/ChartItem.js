import { Dimensions, StyleSheet, View } from 'react-native';
import React, { Fragment } from 'react';
import { PieChart } from 'react-native-chart-kit';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../../../styles/global';
import { colors } from '../../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  decimalPlaces: 2,
  useShadowColorFromDataset: false, // optional
};

const widthScreen = Dimensions.get('window').width;

const ChartItem = ({ item }) => {
  const percentage = (items) => {
    let finished = 0,
      notFinished = 0;

    items.forEach((item) => {
      switch (item.checked) {
        case 1:
          finished += 1;
          break;
        case 0:
          notFinished += 1;
          break;

        default:
          break;
      }
    });

    return [
      {
        name: 'Realizadas',
        legendFontColor: colors.black,
        legendFontSize: RFValue(12),
        percentage: finished,
        color: colors.into,
      },
      {
        name: 'No realizadas',
        legendFontColor: colors.black,
        legendFontSize: RFValue(12),
        percentage: notFinished,
        color: colors.warning,
      },
    ];
  };
  return (
    <Fragment>
      <Text
        underlineColor={colors.primary}
        theme={theme}
        style={styles.textCenter}
      >{`Evaluación de cumplimiento`}</Text>

      <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleTop}>ITEM</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleTop}>CHECK</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleTop}>COMENTARIO</Text>
          </View>
        </View>
        {item.items.map((sup, index) => (
          <View style={styles.containerItem} key={index}>
            <View style={styles.sectionContainer}>
              <Text>{sup.item}</Text>
            </View>
            <View style={styles.centerContainer}>
              <FontAwesome
                name={sup.checked !== 0 ? 'check' : 'times'}
                color={sup.checked !== 0 ? colors.into : colors.after}
              />
              <Text style={styles.leftContainer}>
                {sup.checked !== 0 ? 'Realizado' : 'No realizado'}
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text>{sup.commentary}</Text>
            </View>
          </View>
        ))}

        <ScrollView horizontal={true}>
          <PieChart
            data={percentage(item.items)}
            width={widthScreen}
            height={RFValue(180)}
            chartConfig={chartConfig}
            accessor={'percentage'}
            backgroundColor={'transparent'}
          />
        </ScrollView>
        <Text style={styles.bottomCommentary}>
          {item.commentary ? item.commentary : 'No hay comentarios adicionales'}
        </Text>
      </ScrollView>
    </Fragment>
  );
};

export default ChartItem;

const styles = StyleSheet.create({
  bottomCommentary: { marginBottom: '5%' },
  centerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: '2.5%',
    width: '33.3%',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 5,
    elevation: 5,
    margin: 10,
    padding: '2.5%',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  containerItem: {
    borderBottomColor: colors.inactive,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  leftContainer: { marginLeft: '2.5%' },
  sectionContainer: { alignItems: 'flex-start', justifyContent: 'center', width: '33.3%' },
  textCenter: {
    fontSize: RFValue(20),
    margin: 5,
    marginTop: 30,
    textAlign: 'center',
  },
  titleTop: { fontWeight: 'bold' },
  topContainer: { flexDirection: 'row', marginBottom: '2.5%' },
});

ChartItem.propTypes = {
  item: PropTypes.object.isRequired,
};
