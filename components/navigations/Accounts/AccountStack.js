import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../../../views/Accounts/Index';

const Stack = createStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="accounts" options={{ headerShown: false }} component={Account} />
    </Stack.Navigator>
  );
};

export default AccountStack;
