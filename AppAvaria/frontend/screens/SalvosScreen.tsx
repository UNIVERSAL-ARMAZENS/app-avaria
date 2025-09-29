import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { cores } from '../styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RegistroPendente } from '../navigation/AppStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Salvos'>;

export default function SalvosScreen({ navigation, route }: Props) {
  const { salvos, setSalvos } = route.params;

  // State local para controlar a lista do FlatList
  const [lista, setLista] = useState<RegistroPendente[]>(salvos || []);

  // Sincroniza sempre que 'salvos' mudar
  useEffect(() => {
    setLista(salvos || []);
  }, [salvos]);

  const handleNovaAvaria = () => {
    const novoRegistro: RegistroPendente = {
      id: Date.now().toString(),
      conhecimento: '',
      quantidade: '',
      horarioDeslacre: new Date(),
      horarioInicio: new Date(),
      horarioFim: new Date(),
      descricao: '',
      imagens: [],
      ultimaTela: 'Registro',
    };
    navigation.navigate('Registro', { ...novoRegistro, salvos, setSalvos });
  };

  const handleEditar = (registro: RegistroPendente) => {
    if (registro.ultimaTela === 'Fotos') {
      navigation.navigate('Fotos', { ...registro, salvos, setSalvos, descricao: registro.descricao || '', imagens: registro.imagens || [] });
    } else {
      navigation.navigate('Registro', { ...registro, salvos, setSalvos });
    }
  };

 const handleExcluir = (registroId: string) => {
  const registro = lista.find(r => r.id === registroId);
  if (!registro) return;

  Alert.alert(
    'Confirmar exclusão',
    'Tem certeza que deseja excluir esta avaria?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: () => {
          const atualizados = lista.filter(r => r.id !== registroId);
          setLista(atualizados);
          setSalvos(atualizados);
        } 
      },
    ],
    { cancelable: true }
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pendências de Avarias</Text>
      
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text><Text style={{ fontWeight: 'bold' }}>Conhecimento:</Text> {item.conhecimento}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>Quantidade:</Text> {item.quantidade}</Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Horários:</Text> 
              {new Date(item.horarioDeslacre).toLocaleTimeString()} - {new Date(item.horarioInicio).toLocaleTimeString()} - {new Date(item.horarioFim).toLocaleTimeString()}
            </Text>
            <Text><Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {item.descricao || '-'}</Text>

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => handleEditar(item)} style={styles.botao}>
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>
          
              <TouchableOpacity onPress={() => handleExcluir(item.id)} style={[styles.botao, { marginLeft: 10 }]}>
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleNovaAvaria} style={styles.botaoNova}>
        <Text style={styles.botaoTexto}>Nova Avaria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: cores.fundo },
  titulo: { fontSize:20, fontWeight:'700', color:cores.branco, marginBottom:20, textAlign:'center' },
  card: { backgroundColor:'#fff', padding:15, borderRadius:8, marginBottom:15 },
  botoes: { flexDirection:'row', justifyContent:'flex-end', marginTop:10 },
  botao: { backgroundColor:cores.secundario, padding:10, borderRadius:6 },
  botaoTexto: { color:'#fff', fontWeight:'600' },
  botaoNova: { marginTop:20, backgroundColor:cores.secundario, padding:15, borderRadius:8, alignItems:'center' },
});
