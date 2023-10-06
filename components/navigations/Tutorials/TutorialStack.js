import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../../styles/colors';
import Tutorials from '../../../views/Tutorials/Index';

const Stack = createStackNavigator();

const TutorialStack = () => {
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
        name="tutorials"
        options={{ headerShown: false, title: 'Supervisión' }}
        component={Tutorials}
      />
    </Stack.Navigator>
  );
};

export default TutorialStack;
