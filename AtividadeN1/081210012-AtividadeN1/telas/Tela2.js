import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Tela2({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela 2</Text>
      <Text style={styles.subtitle}>Esta tela aparece de baixo para cima.</Text>
      <Button
        title="Avançar para Tela 3"
        // 'Home' para 'Tela3' para seguir o fluxo
        onPress={() => navigation.navigate('Tela3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff9c4',
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