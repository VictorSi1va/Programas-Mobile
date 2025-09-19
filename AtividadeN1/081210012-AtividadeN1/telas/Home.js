import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Principal (Home)</Text>
      <Text style={styles.subtitle}>Clique no botão para iniciar o fluxo.</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Navegação (Ir para Tela 1)"
          onPress={() => navigation.navigate('Tela1')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: 'gray',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});