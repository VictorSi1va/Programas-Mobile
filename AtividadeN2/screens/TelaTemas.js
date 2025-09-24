import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import * as DB from '../dbservice';

export default function TelaTemas() {
  const [nome, setNome] = useState('');
  const [temas, setTemas] = useState([]);

  const carregar = async () => setTemas(await DB.listarTemasComTotal());

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    if (!nome.trim()) return Alert.alert('Digite o nome do tema.');
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    await DB.adicionarTema({ id, nome });
    setNome('');
    await carregar();
  };

  const excluir = async (id) => {
    await DB.excluirTema(id);
    await carregar();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Novo Tema</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do tema" />
      <TouchableOpacity style={styles.btn} onPress={salvar}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>

      <Text style={styles.title}>Temas cadastrados</Text>
      {temas.map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.nome} ({t.total})</Text>
          <TouchableOpacity onPress={() => excluir(t.id)}><Text style={{ color: 'red' }}>Excluir</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', marginVertical: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  btn: { backgroundColor: '#5B6CFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginVertical: 6, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontWeight: '700' },
});
