import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useContext } from 'react';
import { size } from 'lodash';
import AuthContext from '../../../context/auth/authContext';
import { StyleSheet } from 'react-native';
import AccountStack from '../Accounts/AccountStack';
import CodeStack from '../Codes/CodeStack';
import ReportStack from '../Reports/ReportStack';
import IncidentStack from '../Incidents/IncidentStack';
import AlertStack from '../Alerts/AlertStack';
import SupervysorStack from '../Supervysor/SupervysorStack';
import DocumentStack from '../Documents/DocumentStack';
import TutorialStack from '../Tutorials/TutorialStack';
import AssetStack from '../Assets/AssetsStack';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const isActive = () => {
    const client = user.clients.find((client) => user.selected_client === client.id);
    return client.status !== 0;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'tab-account':
              iconName = 'exchange-alt';
              break;
            case 'tab-code':
              iconName = 'qrcode';
              break;
            case 'tab-report':
              iconName = 'chart-bar';
              break;
            case 'tab-incident':
              iconName = 'book-open';
              break;
            case 'tab-alert':
              iconName = 'exclamation-triangle';
              break;
            case 'tab-supervysor':
              iconName = 'user-check';
              break;
            case 'tab-document':
              iconName = 'file-pdf';
              break;
            case 'tab-tutorial':
              iconName = 'youtube';
              break;
            case 'tab-assets':
              iconName = 'laptop';
              break;

            default:
              iconName = 'question-circle';
              break;
          }
          return <FontAwesome name={iconName} size={size} color={color} solid={focused} />;
        },
        headerShown: false,
        tabBarActiveTintColor: colors.inactiveTint,
        tabBarInactiveTintColor: colors.inactiveTint,
        tabBarStyle: styles.container,
        tabBarActiveBackgroundColor: colors.selected,
        tabBarItemStyle: styles.badge,
      })}
    >
      {size(user?.clients) > 1 && (
        <Tab.Screen
          name="tab-account"
          options={{ title: 'Cliente', tabBarShowLabel: false }}
          component={AccountStack}
        />
      )}

      {user?.roles[0]?.name !== 'Monitoreo' && isActive() && (
        <Tab.Screen
          name="tab-code"
          options={{ title: 'Lectura', tabBarShowLabel: false }}
          component={CodeStack}
        />
      )}

      {user?.roles[0]?.name !== 'Oficial de Seguridad' &&
        user?.roles[0]?.name !== 'Administrador' &&
        isActive() && (
          <Tab.Screen
            name="tab-report"
            options={{ title: 'Reportes', tabBarShowLabel: false }}
            component={ReportStack}
          />
        )}

      {user?.roles[0]?.name !== 'Administrador' && isActive() && (
        <Tab.Screen
          name="tab-incident"
          options={{ title: 'Incidencias', tabBarShowLabel: false }}
          component={IncidentStack}
        />
      )}

      {user?.roles[0]?.name !== 'Administrador' && isActive() && (
        <Tab.Screen
          name="tab-document"
          options={{ title: 'Documentos', tabBarShowLabel: false }}
          component={DocumentStack}
        />
      )}

      {user?.roles[0]?.name === 'Oficial de Seguridad' && isActive() && (
        <Tab.Screen
          name="tab-alert"
          options={{ title: 'Alertas', tabBarShowLabel: false }}
          component={AlertStack}
        />
      )}

      {user?.roles[0]?.name === 'Supervisor' && isActive() && (
        <Tab.Screen
          name="tab-supervysor"
          options={{ title: 'Supervisión', tabBarShowLabel: false }}
          component={SupervysorStack}
        />
      )}

      {user?.roles[0]?.name === 'Supervisor' && isActive() && (
        <Tab.Screen
          name="tab-assets"
          options={{ title: 'Activos', tabBarShowLabel: false }}
          component={AssetStack}
        />
      )}

      {isActive() && (
        <Tab.Screen
          name="tab-tutorial"
          options={{ title: 'Tutoriales', tabBarShowLabel: false }}
          component={TutorialStack}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  badge: {
    flex: 1,
    fontSize: RFValue(25),
  },
  container: {
    backgroundColor: colors.secondary,
    borderTopWidth: 0,
    elevation: 0,
    height: '10%',
  },
});
