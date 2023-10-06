import { View } from 'react-native';
import React from 'react';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import globalStyles from '../../styles/global';
import { FlatList } from 'react-native';
import { colors } from '../../styles/colors';
import { useContext } from 'react';
import IncidentContext from '../../context/incidents/incidentContext';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import Item from './Item';
import { size } from 'lodash';
import PropTypes from 'prop-types';

const ListIncidents = ({ navigation }) => {
  const isFocused = useIsFocused();

  const incidentContext = useContext(IncidentContext);
  const { incidents, loading, getIncidents, clear } = incidentContext;

  useEffect(() => {
    if (isFocused) {
      getIncidents();
    } else {
      clear();
    }
  }, [isFocused]);

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={globalStyles.secondaryContainer}>
          {size(incidents) > 0 ? (
            <>
              <Text style={globalStyles.title}>Incidencias registradas</Text>
              <FlatList
                data={incidents}
                style={styles.flatList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Item item={item} navigation={navigation} />}
              />
            </>
          ) : (
            <Text style={globalStyles.title}>No hay incidencias registradas</Text>
          )}
        </View>
      )}
      <FAB
        icon="plus"
        style={globalStyles.fab}
        onPress={() => {
          navigation.navigate('newIncident');
        }}
      />
    </View>
  );
};

export default ListIncidents;

ListIncidents.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  flatList: { flex: 1 },
});
