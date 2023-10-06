import { Platform, StyleSheet } from 'react-native';
import { DefaultTheme /*, configureFonts */ } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from './colors';

//COVI FONTS
export const configFonts = {
  ios: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ ios: 'bold', android: undefined }),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },

  android: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ ios: 'bold', android: undefined }),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },
  default: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ ios: 'bold', android: undefined }),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
  },
  //fonts: configureFonts(configFonts),
};

const globalStyles = StyleSheet.create({
  container: { backgroundColor: colors.accent, flex: 1, margin: 0 },
  fab: {
    backgroundColor: colors.secondary,
    bottom: 0,
    color: colors.white,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
  fabLeft: {
    backgroundColor: colors.secondary,
    bottom: 0,
    color: colors.white,
    left: 0,
    margin: 16,
    position: 'absolute',
  },
  flatList: { flex: 1 },
  input: {
    backgroundColor: colors.white,
    color: colors.primary,
    fontSize: RFValue(16),
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  normalText: {
    fontSize: RFValue(14),
    margin: 10,
  },
  rowDirection: {
    flexDirection: 'row',
    padding: '2.5%',
  },
  secondaryContainer: {
    flex: 1,
    margin: '2.5%',
  },
  title: {
    color: colors.black,
    fontSize: RFValue(25),
    marginBottom: RFValue(30),
    marginTop: RFValue(50),
    textAlign: 'center',
  },
});

export default globalStyles;
