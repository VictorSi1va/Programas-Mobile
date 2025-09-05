import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function limpar() {
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
  }

  function validarCampos() {
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
  }

  async function salvar() {
    if (!validarCampos()) {
      return;
    }

    let objUsuario = {
      nome: nome,
      email: email,
      senha: senha,
    };

    const stringJson = JSON.stringify(objUsuario);

    await AsyncStorage.setItem("@usuario", stringJson);
    Alert.alert("Salvo com sucesso!");
    limpar();
  }

  async function carregar() {
    const conteudoJson = await AsyncStorage.getItem("@usuario");
    if (conteudoJson != null) {
      const objUsuario = JSON.parse(conteudoJson);
      setNome(objUsuario.nome);
      setEmail(objUsuario.email);
      setSenha(objUsuario.senha);
      setConfirmarSenha(objUsuario.senha);
      Alert.alert("Dados carregados!");
    } else {
      Alert.alert("Não há dados cadastrados!");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>Cadastro de Usuário</Text>

      <View style={styles.areaCadastro}>
        <View style={styles.areaCampo}>
          <Text style={styles.legenda}>Nome</Text>
          <TextInput
            style={styles.campo}
            onChangeText={setNome}
            value={nome}
          />
        </View>

        <View style={styles.areaCampo}>
          <Text style={styles.legenda}>Email</Text>
          <TextInput
            style={styles.campo}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.areaCampo}>
          <Text style={styles.legenda}>Senha</Text>
          <TextInput
            style={styles.campo}
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.areaCampo}>
          <Text style={styles.legenda}>Confirmar Senha</Text>
          <TextInput
            style={styles.campo}
            onChangeText={setConfirmarSenha}
            value={confirmarSenha}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View style={styles.areaBotoes}>
        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
          <Text style={styles.legendaBotao}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoLimpar} onPress={limpar}>
          <Text style={styles.legendaBotao}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCarregar} onPress={carregar}>
          <Text style={styles.legendaBotao}>Carregar</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  areaCadastro: {
    width: '100%',
  },
  areaCampo: {
    marginBottom: 15,
  },
  legenda: {
    fontSize: 16,
    marginBottom: 5,
  },
  campo: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  areaBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  botaoSalvar: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  botaoLimpar: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  botaoCarregar: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  legendaBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
});