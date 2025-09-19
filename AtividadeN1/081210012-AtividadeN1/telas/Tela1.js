import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Tela1({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela 1</Text>
      <Text style={styles.subtitle}>Esta tela não possui cabeçalho.</Text>
      <Button
        title="Avançar para Tela 2"
        // 'Home' para 'Tela2' para seguir o fluxo
        onPress={() => navigation.navigate('Tela2')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
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