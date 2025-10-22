import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { cores } from '../styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RegistroPendente } from '../navigation/AppStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Salvos'>;

export default function SalvosScreen({ navigation, route }: Props) {
  const { salvos, setSalvos } = route.params;
  const [lista, setLista] = useState<RegistroPendente[]>(salvos || []);

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
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Conhecimento: <Text style={styles.cardValue}>{item.conhecimento || '-'}</Text></Text>
            <Text style={styles.cardLabel}>Quantidade: <Text style={styles.cardValue}>{item.quantidade || '-'}</Text></Text>
            <Text style={styles.cardLabel}>
              Horários: <Text style={styles.cardValue}>
                {new Date(item.horarioDeslacre).toLocaleTimeString()} - {new Date(item.horarioInicio).toLocaleTimeString()} - {new Date(item.horarioFim).toLocaleTimeString()}
              </Text>
            </Text>
            <Text style={styles.cardLabel}>Descrição: <Text style={styles.cardValue}>{item.descricao || '-'}</Text></Text>

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => handleEditar(item)} style={styles.botao}>
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleExcluir(item.id)} style={[styles.botao, { marginLeft: 10, backgroundColor: '#EF4444' }]}>
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
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#0F172A',
  },
  titulo: {
     color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
    marginTop: 50,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  cardLabel: {
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardValue: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  botao: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  botaoNova: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});
