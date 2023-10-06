import React, { useContext } from 'react';
import DrawerStack from '../Drawer/DrawerStack';
import { useEffect } from 'react';
import NotificationsContext from '../../../context/notifications/notificationsContext';

const MenuStack = () => {
  const notifications = useContext(NotificationsContext);
  const { subscribe } = notifications;
  useEffect(() => {
    subscribe();
  }, []);

  return <DrawerStack />;
};

export default MenuStack;
