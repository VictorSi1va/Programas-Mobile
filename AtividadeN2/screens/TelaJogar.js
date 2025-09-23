import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import * as DB from '../dbservice';

export default function TelaJogar() {
  const [temas,setTemas]=useState([]);
  const [temaId,setTemaId]=useState(null);
  const [qtd,setQtd]=useState('5');
  const [perguntas,setPerguntas]=useState([]);
  const [pos,setPos]=useState(0);
  const [respostas,setRespostas]=useState([]);
  const [acabou,setAcabou]=useState(false);

  useEffect(()=>{(async()=>setTemas(await DB.listarTemasComTotal()))();},[]);

  const iniciar=async()=>{
    if(!temaId) return Alert.alert('Escolha um tema');
    const total=(temas.find(t=>t.id===temaId)?.total)||0;
    const n=parseInt(qtd)||1;
    if(total<n) return Alert.alert(`Este tema tem só ${total} perguntas`);
    setPerguntas(await DB.obterPerguntasAleatorias(temaId,n));
    setPos(0);setRespostas([]);setAcabou(false);
  };

  const escolher=(i)=>{
    const p=perguntas[pos];
    const r={enunciado:p.enunciado,escolhida:i,correta:p.correta,alts:[p.alt1,p.alt2,p.alt3,p.alt4]};
    const novo=[...respostas,r];
    if(pos+1>=perguntas.length){setRespostas(novo);setAcabou(true);}
    else{setRespostas(novo);setPos(pos+1);}
  };

  const percent=acabou?Math.round(respostas.filter(r=>r.escolhida===r.correta).length/respostas.length*100):0;

  return(
    <ScrollView style={{padding:16}}>
      {!perguntas.length&&!acabou&&(
        <>
          <Text style={styles.title}>Escolha um Tema</Text>
          {temas.map(t=>(
            <TouchableOpacity key={t.id} onPress={()=>setTemaId(t.id)}>
              <Text style={[styles.tema,temaId===t.id&&styles.temaAtivo]}>{t.nome} ({t.total})</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.title}>Quantidade</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={qtd} onChangeText={setQtd}/>
          <TouchableOpacity style={styles.btn} onPress={iniciar}><Text style={styles.btnText}>Começar</Text></TouchableOpacity>
        </>
      )}

      {perguntas[pos]&&!acabou&&(
        <View style={styles.card}>
          <Text style={styles.title}>{perguntas[pos].enunciado}</Text>
          {[1,2,3,4].map(i=>(
            <TouchableOpacity key={i} style={styles.btnAlt} onPress={()=>escolher(i)}>
              <Text>{i}) {perguntas[pos][`alt${i}`]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {acabou&&(
        <View>
          <Text style={styles.title}>Você acertou {percent}%</Text>
          {respostas.map((r,i)=>(
            <View key={i} style={styles.card}>
              <Text>{r.enunciado}</Text>
              <Text>{r.escolhida===r.correta?'✅ Acertou':'❌ Errou'}</Text>
              {r.escolhida!==r.correta&&<Text>Correta: {r.correta}) {r.alts[r.correta-1]}</Text>}
            </View>
          ))}
          <TouchableOpacity style={styles.btn} onPress={()=>{setPerguntas([]);setAcabou(false);}}>
            <Text style={styles.btnText}>Jogar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles=StyleSheet.create({
  title:{fontSize:18,fontWeight:'700',marginVertical:10},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10,marginVertical:5,backgroundColor:'#fff'},
  btn:{backgroundColor:'#5B6CFF',padding:12,borderRadius:8,alignItems:'center',marginVertical:8},
  btnText:{color:'#fff',fontWeight:'700'},
  tema:{padding:8,borderWidth:1,borderColor:'#ccc',borderRadius:6,marginVertical:4},
  temaAtivo:{backgroundColor:'#5B6CFF',color:'#fff'},
  card:{backgroundColor:'#fff',padding:12,borderRadius:8,marginVertical:6,borderWidth:1,borderColor:'#eee'},
  btnAlt:{borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:10,marginVertical:4},
});
