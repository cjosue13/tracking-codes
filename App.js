/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './views/Home/Home';
import { theme } from './styles/global';
import AuthState from './context/auth/authState';
import MarkState from './context/mark/markState';
import 'react-native-gesture-handler';
import ReportState from './context/reports/reportState';
import IncidentState from './context/incidents/incidentState';
import AlertState from './context/alerts/alertState';
import SupervysorState from './context/Supervysors/supervysorState';
import DocumentState from './context/documents/documentState';
import NotificationState from './context/notifications/notificationsState';
import AssetState from './context/assets/assetState.';

/*import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const clear = async () => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === 'android') {
      await AsyncStorage.clear();
    }
    if (Platform.OS === 'ios') {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    }
  }
};*/

const App: () => Node = () => {
  // clear(-);
  return (
    <AuthState>
      <MarkState>
        <ReportState>
          <IncidentState>
            <AlertState>
              <SupervysorState>
                <DocumentState>
                  <NotificationState>
                    <AssetState>
                      <PaperProvider theme={theme}>
                        <Home />
                      </PaperProvider>
                    </AssetState>
                  </NotificationState>
                </DocumentState>
              </SupervysorState>
            </AlertState>
          </IncidentState>
        </ReportState>
      </MarkState>
    </AuthState>
  );
};

export default App;
