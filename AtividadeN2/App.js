import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import * as DB from './dbservice';
import TelaTemas from './screens/TelaTemas';
import TelaPerguntas from './screens/TelaPerguntas';
import TelaJogar from './screens/TelaJogar';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Quiz!</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Temas')}>
        <Text style={styles.btnText}>Gerenciar Temas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Perguntas')}>
        <Text style={styles.btnText}>Gerenciar Perguntas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Jogar')}>
        <Text style={styles.btnText}>Jogar Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      await DB.createTables();
      await DB.popularDadosIniciais();
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Início" component={HomeScreen} />
        <Stack.Screen name="Temas" component={TelaTemas} />
        <Stack.Screen name="Perguntas" component={TelaPerguntas} />
        <Stack.Screen name="Jogar" component={TelaJogar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6fb' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 30 },
  btn: { backgroundColor: '#5B6CFF', padding: 14, borderRadius: 10, marginVertical: 8, width: 200, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
