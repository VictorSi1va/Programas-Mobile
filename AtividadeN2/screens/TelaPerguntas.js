import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import * as DB from '../dbservice';

export default function TelaPerguntas() {
  const [temas, setTemas] = useState([]);
  const [temaId, setTemaId] = useState(null);
  const [enunciado, setEnunciado] = useState('');
  const [alts, setAlts] = useState(['', '', '', '']);
  // 👇 agora string, começa vazio (permite apagar o campo)
  const [correta, setCorreta] = useState('');
  const [perguntas, setPerguntas] = useState([]);

  const carregar = async (id = temaId) => {
    const ts = await DB.listarTemasComTotal();
    setTemas(ts);
    if (id) setPerguntas(await DB.listarPerguntasPorTema(id));
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    // validações básicas
    if (!temaId || !enunciado.trim() || alts.some(a => !a.trim())) {
      return Alert.alert('Preencha todos os campos.');
    }

    // 👇 converte e valida a alternativa correta (1-4)
    const n = parseInt(correta, 10);
    if (!Number.isInteger(n) || n < 1 || n > 4) {
      return Alert.alert('Informe um número da correta entre 1 e 4.');
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    await DB.adicionarPergunta({
      id,
      tema_id: temaId,
      enunciado,
      alt1: alts[0],
      alt2: alts[1],
      alt3: alts[2],
      alt4: alts[3],
      correta: n, // 👈 salva como número válido
    });

    // limpa o formulário
    setEnunciado('');
    setAlts(['', '', '', '']);
    setCorreta(''); // 👈 volta a ficar vazio
    await carregar(temaId);
  };

  const excluir = async (id) => { await DB.excluirPergunta(id); await carregar(temaId); };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Selecione um Tema</Text>
      {temas.map(t => (
        <TouchableOpacity key={t.id} onPress={() => { setTemaId(t.id); carregar(t.id); }}>
          <Text style={[styles.tema, temaId===t.id && styles.temaAtivo]}>{t.nome}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.title}>Nova Pergunta</Text>
      <TextInput style={styles.input} value={enunciado} onChangeText={setEnunciado} placeholder="Enunciado" />
      {alts.map((a,i)=>(
        <TextInput
          key={i}
          style={styles.input}
          value={a}
          onChangeText={v=>{const arr=[...alts];arr[i]=v;setAlts(arr);}}
          placeholder={`Alternativa ${i+1}`}
        />
      ))}

      <Text style={{marginTop:6}}>Número da correta (1-4):</Text>
      {/* 👇 agora deixa apagar sem forçar 1 */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={correta}
        onChangeText={setCorreta}
        placeholder="Ex.: 1"
      />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Perguntas</Text>
      {perguntas.map(p=>(
        <View key={p.id} style={styles.card}>
          <Text>{p.enunciado}</Text>
          <Text>Correta: {p.correta}</Text>
          <TouchableOpacity onPress={()=>excluir(p.id)}><Text style={{color:'red'}}>Excluir</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles=StyleSheet.create({
  title:{fontSize:18,fontWeight:'700',marginVertical:10},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10,marginVertical:5,backgroundColor:'#fff'},
  btn:{backgroundColor:'#5B6CFF',padding:12,borderRadius:8,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'700'},
  tema:{padding:8,borderWidth:1,borderColor:'#ccc',borderRadius:6,marginVertical:4},
  temaAtivo:{backgroundColor:'#5B6CFF',color:'#fff'},
  card:{backgroundColor:'#fff',padding:12,borderRadius:8,marginVertical:6,borderWidth:1,borderColor:'#eee'},
});
