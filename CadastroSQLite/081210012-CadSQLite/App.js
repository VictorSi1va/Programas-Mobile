import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import * as DBService from './dbservice';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function App() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      try {
        await DBService.createTable();
        await carregarDados();
      } catch (e) {
        console.error("Erro na inicialização do DB", e);
        Alert.alert('Erro', 'Falha ao inicializar o banco de dados.');
      }
    };
    initDb();
  }, []);

  const carregarDados = async () => {
    try {
      const usuarios = await DBService.obtemTodosUsuarios();
      setListaUsuarios(usuarios);
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
    }
  };

  const validarCampos = () => {
    if (nome.trim() === '') {
      Alert.alert('Erro de Validação', 'O nome é obrigatório.');
      return false;
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      Alert.alert('Erro de Validação', 'Por favor, insira um e-mail válido.');
      return false;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro de Validação', 'A senha e a confirmação de senha devem ser iguais.');
      return false;
    }
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
    if (!regexSenha.test(senha)) {
      Alert.alert('Erro de Validação', 'A senha deve ter no mínimo 5 dígitos, 1 letra maiúscula e 1 número.');
      return false;
    }
    return true;
  };

  const limparCampos = () => {
    setId(null);
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    Keyboard.dismiss();
  };

  const salvarDados = async () => {
    if (!validarCampos()) return;
    
    let novoRegistro = (id === null);

    const objUsuario = {
      id: novoRegistro ? generateId() : id,
      nome: nome,
      email: email,
      senha: senha,
    };

    try {
      let resposta = false;
      if (novoRegistro) {
        resposta = await DBService.adicionarUsuario(objUsuario);
      } else {
        resposta = await DBService.atualizarUsuario(objUsuario);
      }
      
      if (resposta) {
        Alert.alert('Sucesso', `Usuário ${novoRegistro ? 'incluído' : 'editado'} com sucesso!`);
        await carregarDados();
        limparCampos();
      } else {
        Alert.alert('Erro', `Falha ao ${novoRegistro ? 'incluir' : 'editar'} o usuário.`);
      }

    } catch (e) {
      Alert.alert('Erro', e.toString());
    }
  };

  const editar = (identificador) => {
    const usuario = listaUsuarios.find(u => u.id === identificador);
    if (usuario) {
      setId(usuario.id);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setSenha(usuario.senha);
      setConfirmarSenha(usuario.senha);
    }
    Keyboard.dismiss();
  };

  const removerUsuario = (identificador) => {
    Alert.alert('Atenção', 'Confirma a remoção do usuário?',
      [
        { text: 'Sim', onPress: async () => {
            try {
              const sucesso = await DBService.excluirUsuario(identificador);
              if (sucesso) {
                Alert.alert('Sucesso', 'Usuário removido!');
                await carregarDados();
                limparCampos();
              } else {
                Alert.alert('Erro', 'Falha ao remover usuário.');
              }
            } catch (e) {
              Alert.alert('Erro', e.toString());
            }
          }
        },
        { text: 'Não', style: 'cancel' }
      ]
    );
  };

  const apagarTudo = () => {
    Alert.alert('Muita atenção!', 'Confirma a exclusão de todos os usuários?',
      [
        { text: 'Sim, confirmo!', onPress: async () => {
            try {
              await DBService.excluirTodosUsuarios();
              setListaUsuarios([]);
              Alert.alert('Sucesso', 'Registros removidos!');
            } catch (e) {
              Alert.alert('Erro', e.toString());
            }
          }
        },
        { text: 'Não', style: 'cancel' }
      ]
    );
  };

  const renderUsuario = (usuario) => (
    <View key={usuario.id} style={styles.listItem}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.itemText}>Nome: {usuario.nome}</Text>
        <Text style={styles.itemText}>Email: {usuario.email}</Text>
      </View>
      <View style={styles.itemButtons}>
        <TouchableOpacity onPress={() => editar(usuario.id)}>
          <Entypo name="edit" size={32} color="black" style={{marginRight: 15}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removerUsuario(usuario.id)}>
          <FontAwesome name="remove" size={32} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro de Usuários</Text>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="person" size={24} color="gray" style={styles.icon} />
                <TextInput style={styles.input} onChangeText={setNome} value={nome} placeholder="Nome do usuário" />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="mail" size={24} color="gray" style={styles.icon} />
                <TextInput style={styles.input} onChangeText={setEmail} value={email} keyboardType="email-address" placeholder="seuemail@exemplo.com" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="lock-closed" size={24} color="gray" style={styles.icon} />
                <TextInput style={styles.input} onChangeText={setSenha} value={senha} secureTextEntry={true} placeholder="Sua senha" />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="lock-closed" size={24} color="gray" style={styles.icon} />
                <TextInput style={styles.input} onChangeText={setConfirmarSenha} value={confirmarSenha} secureTextEntry={true} placeholder="Confirme sua senha" />
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={salvarDados}>
              <Text style={styles.buttonText}>{id ? 'Salvar Edição' : 'Incluir'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={limparCampos}>
              <Text style={styles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={apagarTudo}>
            <Text style={styles.buttonText}>Apagar Todos</Text>
          </TouchableOpacity>

          <Text style={styles.listTitle}>Usuários Cadastrados:</Text>
          {listaUsuarios.map(renderUsuario)}
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 40,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingRight: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    alignSelf: 'center',
    width: '100%',
    marginVertical: 5,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  usuarioInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});