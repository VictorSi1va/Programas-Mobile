import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  // === Gerenciamento de Estado ===
  // Hooks para armazenar os valores dos campos e o resultado.
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [resultado, setResultado] = useState('');

  // === Lógica da Calculadora ===
  // Função que realiza as operações matemáticas.
  const calcular = (operacao) => {
    if (num1 === '' || num2 === '') {
      Alert.alert('Erro', 'Por favor, insira os dois números.');
      return;
    }

    const numero1 = parseFloat(num1);
    const numero2 = parseFloat(num2);
    let resultadoCalculado = 0;

    switch (operacao) {
      case 'soma':
        resultadoCalculado = numero1 + numero2;
        break;
      case 'subtracao':
        resultadoCalculado = numero1 - numero2;
        break;
      case 'multiplicacao':
        resultadoCalculado = numero1 * numero2;
        break;
      case 'divisao':
        if (numero2 === 0) {
          Alert.alert('Erro', 'Não é possível dividir por zero.');
          return;
        }
        resultadoCalculado = numero1 / numero2;
        break;
      case 'exponenciacao':
        resultadoCalculado = Math.pow(numero1, numero2);
        break;
      default:
        break;
    }

    setResultado(resultadoCalculado.toString());
  };

  // Função para limpar os campos da tela.
  const limparCampos = () => {
    setNum1('');
    setNum2('');
    setResultado('');
  };

  // === Renderização da UI ===
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora</Text>

      <TextInput
        style={styles.input}
        placeholder="Primeiro número"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo número"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botao} onPress={() => calcular('soma')}>
          <Text style={styles.textoBotao}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => calcular('subtracao')}>
          <Text style={styles.textoBotao}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => calcular('multiplicacao')}>
          <Text style={styles.textoBotao}>*</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => calcular('divisao')}>
          <Text style={styles.textoBotao}>/</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => calcular('exponenciacao')}>
          <Text style={styles.textoBotao}>^</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoLimpar} onPress={limparCampos}>
        <Text style={styles.textoBotaoLimpar}>Limpar</Text>
      </TouchableOpacity>

      <Text style={styles.resultado}>Resultado: {resultado}</Text>
    </View>
  );
}

// === Estilos ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  botaoLimpar: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotaoLimpar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultado: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
});