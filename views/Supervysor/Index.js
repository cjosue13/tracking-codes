import { FlatList, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import Item from './Item';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import SupervysorContext from '../../context/Supervysors/supervysorContext';
import globalStyles from '../../styles/global';
import { colors } from '../../styles/colors';
import { size } from 'lodash';

const Index = ({ navigation }) => {
  const supervysorContext = useContext(SupervysorContext);
  const { clear, getSupervysors, supervysors, loading } = supervysorContext;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      clear();
    } else {
      clear();
      getSupervysors();
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
          {size(supervysors.forms) > 0 ? (
            <>
              <Text style={globalStyles.title}>Listado de formularios</Text>
              <FlatList
                data={supervysors.forms}
                style={styles.flatList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Item item={item} navigation={navigation} />}
              />
            </>
          ) : (
            <Text style={globalStyles.title}>No hay formularios registrados</Text>
          )}

          <FAB
            icon="plus"
            color={colors.white}
            style={globalStyles.fab}
            onPress={() => navigation.navigate('register-supervysor')}
          />
        </View>
      )}
    </View>
  );
};

Index.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Index;

const styles = StyleSheet.create({ flatList: { flex: 1 } });
