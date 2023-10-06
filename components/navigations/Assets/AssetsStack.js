import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../../styles/colors';
import Asset from '../../../views/Assets/Index';
import Register from '../../../views/Assets/Register';
import DisableAsset from '../../../views/Assets/DisableAsset';
import ReplaceAsset from '../../../views/Assets/ReplaceAsset';

const Stack = createStackNavigator();

const AssetStack = () => {
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
        name="assets"
        options={{ headerShown: false, title: 'Activos' }}
        component={Asset}
      />
      <Stack.Screen
        name="register-asset"
        options={{
          headerShown: true,
          title: 'Formulario',
          headerTitleAlign: 'center',
        }}
        component={Register}
      />
      <Stack.Screen
        name="disable-asset"
        options={{
          headerShown: true,
          title: 'Formulario',
          headerTitleAlign: 'center',
        }}
        component={DisableAsset}
      />
      <Stack.Screen
        name="replace-asset"
        options={{
          headerShown: true,
          title: 'Detalle',
          headerTitleAlign: 'center',
        }}
        component={ReplaceAsset}
      />
    </Stack.Navigator>
  );
};

export default AssetStack;
