import { FlatList, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import globalStyles from '../../styles/global';
import { colors } from '../../styles/colors';
import DocumentContext from '../../context/documents/documentContext';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { messageView } from '../../utils/message';
import { size } from 'lodash';
import Item from './Item';

const Documents = () => {
  const documentContext = useContext(DocumentContext);
  const { loading, getDocuments, documents, clear, error } = documentContext;
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getDocuments();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
  }, [error]);

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={globalStyles.secondaryContainer}>
            {size(documents) > 0 ? (
              <>
                <Text style={globalStyles.title}>Documentos registrados</Text>
                <FlatList
                  data={documents}
                  style={styles.flatList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <Item item={item} />}
                />
              </>
            ) : (
              <Text style={globalStyles.title}>No hay documentos registrados</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: { flex: 1 },
});

export default Documents;
