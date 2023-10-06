import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Supevysor from '../../../views/Supervysor/Index';
import { colors } from '../../../styles/colors';
import Register from '../../../views/Supervysor/Register';
import DetailSupervysor from '../../../views/Supervysor/DetailSupervysor';

const Stack = createStackNavigator();

const SupervysorStack = () => {
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
        name="supervysors"
        options={{ headerShown: false, title: 'Supervisión' }}
        component={Supevysor}
      />
      <Stack.Screen
        name="register-supervysor"
        options={{
          headerShown: true,
          title: 'Formulario',
          headerTitleAlign: 'center',
        }}
        component={Register}
      />
      <Stack.Screen
        name="detail-supervysor"
        options={{
          headerShown: true,
          title: 'Detalle',
          headerTitleAlign: 'center',
        }}
        component={DetailSupervysor}
      />
    </Stack.Navigator>
  );
};

export default SupervysorStack;
