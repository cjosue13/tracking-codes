import { View } from 'react-native';
import React from 'react';
import globalStyles from '../../styles/global';
import { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import Security from './Security';
import ListIncidents from './ListIncidents';
import PropTypes from 'prop-types';

const Incident = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return (
    <View style={globalStyles.container}>
      {user?.roles[0]?.name === 'Oficial de Seguridad' && <Security />}
      <View style={globalStyles.secondaryContainer}>
        {user?.roles[0]?.name !== 'Oficial de Seguridad' && (
          <ListIncidents navigation={navigation} />
        )}
      </View>
    </View>
  );
};

Incident.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Incident;
