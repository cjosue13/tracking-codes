import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import DrawerContent from '../../ui/partials/DrawerContent';
import ProfileStack from '../Profile/ProfileStack';
import TabNavigation from '../Tab/TabNavigation';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="tab" component={TabNavigation} />
      <Drawer.Screen name="profile" component={ProfileStack} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
