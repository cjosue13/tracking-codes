import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../../styles/colors';
import Documents from '../../../views/Documents';

const Stack = createStackNavigator();

const DocumentStack = () => {
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
        name="documents"
        options={{ headerShown: false, title: 'Documentos' }}
        component={Documents}
      />
    </Stack.Navigator>
  );
};

export default DocumentStack;
