import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { RegistroPendente } from '../navigation/AppStack';

type Registro = {
  id: string;
  conhecimento: string;
  quantidade: string;
  horarioDeslacre: Date;
  horarioInicio: Date;
  horarioFim: Date;
  descricao?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Salvos'>;
export default function SalvosScreen({ navigation, route }: Props) {
  const [salvosState, setSalvosState] = useState<RegistroPendente[]>(route.params.salvos);

  const handleNovaAvaria = () => {
    navigation.navigate('Registro');
  };

  const handleFinalizar = (registroId: string) => {
    const registro = salvosState.find(r => r.id === registroId);
    if (registro) {
      navigation.navigate('Fotos', { ...registro });
      // remover da lista de pendentes
      setSalvosState(prev => prev.filter(r => r.id !== registroId));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pendências de Avarias</Text>

      <FlatList
        data={salvosState}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text><Text style={{fontWeight:'bold'}}>Conhecimento:</Text> {item.conhecimento}</Text>
            <Text><Text style={{fontWeight:'bold'}}>Quantidade:</Text> {item.quantidade}</Text>
            <Text><Text style={{fontWeight:'bold'}}>Horários:</Text> {item.horarioDeslacre.toLocaleTimeString()} - {item.horarioInicio.toLocaleTimeString()} - {item.horarioFim.toLocaleTimeString()}</Text>
            <Text><Text style={{fontWeight:'bold'}}>Descrição:</Text> {item.descricao || '-'}</Text>

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => handleFinalizar(item.id)} style={styles.botao}>
                <Text style={styles.botaoTexto}>Finalizar</Text>
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
  card: { backgroundColor:'#222', padding:15, borderRadius:8, marginBottom:15 },
  botoes: { flexDirection:'row', justifyContent:'flex-end', marginTop:10 },
  botao: { backgroundColor:cores.secundario, padding:10, borderRadius:6 },
  botaoTexto: { color:'#fff', fontWeight:'600' },
  botaoNova: { marginTop:20, backgroundColor:cores.secundario, padding:15, borderRadius:8, alignItems:'center' },
});
