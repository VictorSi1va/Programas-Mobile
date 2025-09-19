import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Tela3({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conteúdo da Tela 3</Text>
      <Text style={styles.subtitle}>O título no cabeçalho foi customizado.</Text>
      <Button
        title="Finalizar e Voltar para Home"
        // finaliza o fluxo
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  }
});