import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../../styles/colors';
import Alerts from '../../../views/Alerts/Index';

const Stack = createStackNavigator();

const AlertStack = () => {
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
        name="codes"
        options={{ headerShown: false, title: 'Alertas' }}
        component={Alerts}
      />
    </Stack.Navigator>
  );
};

export default AlertStack;
