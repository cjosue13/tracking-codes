import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Codes from '../../../views/Codes/Index';
import Register from '../../../views/Codes/Register';
import { colors } from '../../../styles/colors';

const Stack = createStackNavigator();

const CodeStack = () => {
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
        options={{ headerShown: false, title: 'Inicio' }}
        component={Codes}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Marcas',
          headerTitleAlign: 'center',
        }}
        component={Register}
      />
    </Stack.Navigator>
  );
};

export default CodeStack;
