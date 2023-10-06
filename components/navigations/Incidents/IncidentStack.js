import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Incident from '../../../views/Incidents/Index';
import DetailIncident from '../../../views/Incidents/DetailIncident';
import { colors } from '../../../styles/colors';
import Security from '../../../views/Incidents/Security';

const Stack = createStackNavigator();

const IncidentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.header,
      }}
    >
      <Stack.Screen
        name="incidents"
        options={{ headerShown: false, title: 'Incidencias' }}
        component={Incident}
      />
      <Stack.Screen
        name="detailIncident"
        options={{ title: 'Detalle de incidencia', headerTitleAlign: 'center' }}
        component={DetailIncident}
      />
      <Stack.Screen
        name="newIncident"
        options={{ title: 'Registro', headerTitleAlign: 'center' }}
        component={Security}
      />
    </Stack.Navigator>
  );
};

export default IncidentStack;
