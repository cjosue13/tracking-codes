import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Report from '../../../views/Reports/Index';

const Stack = createStackNavigator();

const ReportStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="reports"
        options={{ headerShown: false, title: 'Reportes' }}
        component={Report}
      />
    </Stack.Navigator>
  );
};

export default ReportStack;
