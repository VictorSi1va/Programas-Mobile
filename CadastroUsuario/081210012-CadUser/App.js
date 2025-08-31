// === Importações ===
// Importa as funções e componentes necessários do React e React Native.
// 'useState' é um hook (gancho) do React para gerenciar o estado dos componentes.
// StyleSheet, Text, View, TextInput, TouchableOpacity e Alert são componentes da UI do React Native.
// 'AsyncStorage' é a biblioteca para salvar dados no dispositivo, como um armazenamento local.
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal do aplicativo.
export default function App() {
  // === Gerenciamento de Estado com 'useState' ===
  // Hooks para armazenar os valores de cada campo do formulário.
  // O estado de cada campo é um valor vazio no início.
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // === Funções de Validação ===
  // Função para validar todos os campos do formulário antes de salvar.
  const validarCampos = () => {
    // 1. Valida o Código: verifica se é um número e se é maior que 0.
    if (isNaN(codigo) || parseFloat(codigo) <= 0) {
      Alert.alert('Erro de Validação', 'O código deve ser um número maior que zero.');
      return false;
    }

    // 2. Valida o Nome: verifica se o campo não está vazio após remover espaços em branco.
    if (nome.trim() === '') {
      Alert.alert('Erro de Validação', 'O nome é obrigatório.');
      return false;
    }

    // 3. Valida o Email com Regex: usa uma expressão regular para checar o formato.
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      Alert.alert('Erro de Validação', 'Por favor, insira um e-mail válido.');
      return false;
    }

    // 4. Valida a Senha e Confirmação: verifica se os campos são idênticos.
    if (senha !== confirmarSenha) {
      Alert.alert('Erro de Validação', 'A senha e a confirmação de senha devem ser iguais.');
      return false;
    }

    // 5. Valida a complexidade da Senha com Regex:
    // A expressão regular exige 1 maiúscula, 1 número e um total de 5 ou mais caracteres.
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
    if (!regexSenha.test(senha)) {
      Alert.alert('Erro de Validação', 'A senha deve ter no mínimo 5 dígitos, 1 letra maiúscula e 1 número.');
      return false;
    }

    return true; // Retorna true se todas as validações passarem.
  };

  // === Funções de Persistência (AsyncStorage) ===
  // Função assíncrona para salvar os dados no dispositivo.
  const salvarDados = async () => {
    // Se a validação falhar, a função é interrompida.
    if (!validarCampos()) {
      return;
    }
    // Cria um objeto com os dados do usuário.
    const usuario = { codigo, nome, email, senha };
    try {
      // Salva o objeto no AsyncStorage, convertendo-o para string JSON.
      await AsyncStorage.setItem('usuario_cadastrado', JSON.stringify(usuario));
      Alert.alert('Sucesso', 'Dados do usuário salvos com sucesso!');
    } catch (error) {
      // Exibe um alerta de erro caso o salvamento falhe.
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
      console.error(error);
    }
  };

  // Função assíncrona para carregar os dados do dispositivo.
  const carregarDados = async () => {
    try {
      // Pega a string salva no AsyncStorage.
      const usuarioSalvo = await AsyncStorage.getItem('usuario_cadastrado');
      if (usuarioSalvo !== null) {
        // Converte a string JSON de volta para um objeto.
        const usuario = JSON.parse(usuarioSalvo);
        // Preenche os estados dos campos do formulário com os dados carregados.
        setCodigo(usuario.codigo);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setSenha(usuario.senha);
        setConfirmarSenha(usuario.senha); // Preenche a confirmação também.
        Alert.alert('Sucesso', 'Dados do usuário carregados com sucesso!');
      } else {
        Alert.alert('Aviso', 'Nenhum usuário encontrado no dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
      console.error(error);
    }
  };

  // Função para limpar os campos do formulário.
  const limparDados = () => {
    // Redefine todos os estados para string vazia.
    setCodigo('');
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    Alert.alert('Aviso', 'Campos de formulário limpos.');
  };

  // === Renderização da UI (Interface do Usuário) ===
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      
      <Text style={styles.label}>Código</Text>
      <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} keyboardType="numeric" />

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Senha</Text>
      {/* 'secureTextEntry={true}' esconde o texto digitado (como em senhas). */}
      <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry={true} />

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry={true} />

      {/* Container para os botões 'Salvar' e 'Carregar'. */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={salvarDados}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={carregarDados}>
          <Text style={styles.buttonText}>Carregar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Botão 'Limpar' com estilo separado. */}
      <TouchableOpacity style={styles.limparButton} onPress={limparDados}>
        <Text style={styles.buttonText}>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
}

// === Estilos dos Componentes com 'StyleSheet' ===
// Cria um objeto de estilos para organizar e aplicar o design dos componentes.
const styles = StyleSheet.create({
  container: {
    // 'flex: 1' faz o container ocupar toda a tela.
    flex: 1,
    // Adiciona espaçamento interno.
    padding: 20,
    // Centraliza o conteúdo verticalmente.
    justifyContent: 'center',
    // Define a cor de fundo.
    backgroundColor: '#f0f0f0',
  },
  title: {
    // Define o estilo do título do app.
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    // Define o estilo para os rótulos dos campos.
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    // Estilo para os campos de entrada de texto.
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonRow: {
    // Estilo do container que agrupa os botões 'Salvar' e 'Carregar'.
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    // Estilo comum para os botões 'Salvar' e 'Carregar'.
    flex: 1, // Faz com que os botões se expandam para ocupar o espaço disponível.
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    // Estilo para o texto dentro dos botões.
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  limparButton: {
    // Estilo específico para o botão 'Limpar'.
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    // Ajuste de tamanho e alinhamento para que ele não fique gigante.
    width: '48%', 
    alignSelf: 'center', 
  },
});