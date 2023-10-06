import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../../../views/Profile/Index';
import { colors } from '../../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { IconButton } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {
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
        name="index-profile"
        options={{
          title: 'Perfil',
          headerTitleAlign: 'center',
          headerRight: () => (
            <IconButton
              icon={({ size, color }) => <FontAwesome size={size} color={color} name="home" />}
              size={RFValue(20)}
              color={colors.header}
              onPress={() => navigation.navigate('tab')}
            />
          ),
        }}
        component={Profile}
      />
    </Stack.Navigator>
  );
};

ProfileStack.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileStack;
