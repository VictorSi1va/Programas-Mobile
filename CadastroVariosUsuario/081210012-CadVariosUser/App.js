import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // === Gerenciamento de Estado ===
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); 
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Armazena a lista completa de usuários.
  const [listaUsuarios, setListaUsuarios] = useState([]);
  // Armazena o usuário que está sendo editado, se houver.
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null); 

  // === Funções de Persistência (AsyncStorage) ===
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const salvarUsuarios = async (usuarios) => {
    try {
      await AsyncStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    } catch (error) {
      console.error('Erro ao salvar os usuários:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  const carregarUsuarios = async () => {
    try {
      const usuariosSalvos = await AsyncStorage.getItem('lista_usuarios');
      if (usuariosSalvos !== null) {
        setListaUsuarios(JSON.parse(usuariosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar os usuários:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
    }
  };

  // === Funções de Validação ===
  const validarCampos = () => {
    if (isNaN(codigo) || parseFloat(codigo) <= 0) {
      Alert.alert('Erro', 'O código deve ser um número maior que zero.');
      return false;
    }
    if (nome.trim() === '') {
      Alert.alert('Erro', 'O nome é obrigatório.');
      return false;
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return false;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'A senha e a confirmação de senha devem ser iguais.');
      return false;
    }
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
    if (!regexSenha.test(senha)) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 5 dígitos, 1 letra maiúscula e 1 número.');
      return false;
    }
    return true;
  };

  // === Funções de Manipulação do CRUD ===
  const limparFormulario = () => {
    setCodigo('');
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setUsuarioEmEdicao(null); // Sai do modo de edição
  };

  const incluirUsuario = () => {
    if (!validarCampos()) return;
    const novoUsuario = { codigo, nome, email, senha };
    const novaLista = [...listaUsuarios, novoUsuario];
    setListaUsuarios(novaLista);
    salvarUsuarios(novaLista);
    limparFormulario();
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
  };

  const editarUsuario = (usuario) => {
    setCodigo(usuario.codigo);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setSenha(usuario.senha);
    setConfirmarSenha(usuario.senha);
    setUsuarioEmEdicao(usuario); // Entra no modo de edição
  };

  const salvarEdicao = () => {
    if (!validarCampos()) return;
    const novaLista = listaUsuarios.map(u => 
      u.codigo === usuarioEmEdicao.codigo ? { ...u, nome, email, senha } : u
    );
    setListaUsuarios(novaLista);
    salvarUsuarios(novaLista);
    limparFormulario();
    Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
  };

  const excluirUsuario = (usuarioParaExcluir) => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja excluir o usuário ${usuarioParaExcluir.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            const novaLista = listaUsuarios.filter(u => u.codigo !== usuarioParaExcluir.codigo);
            setListaUsuarios(novaLista);
            salvarUsuarios(novaLista);
            Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.itemText}>Nome: {item.nome}</Text>
        <Text style={styles.itemText}>Email: {item.email}</Text>
      </View>
      <View style={styles.itemButtons}>
        <TouchableOpacity style={[styles.itemButton, styles.editButton]} onPress={() => editarUsuario(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemButton, styles.deleteButton]} onPress={() => excluirUsuario(item)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuários</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Código</Text>
        <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} keyboardType="numeric" editable={!usuarioEmEdicao} />

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry={true} />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry={true} />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={usuarioEmEdicao ? salvarEdicao : incluirUsuario}>
            <Text style={styles.buttonText}>{usuarioEmEdicao ? 'Salvar Edição' : 'Incluir'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.limparButton]} onPress={limparFormulario}>
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.listTitle}>Usuários Cadastrados:</Text>
      <FlatList
        data={listaUsuarios}
        keyExtractor={item => item.codigo}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  limparButton: {
    backgroundColor: '#6c757d',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  itemButtons: {
    flexDirection: 'row',
  },
  itemButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});