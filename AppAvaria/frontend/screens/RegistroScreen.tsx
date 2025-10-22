import React, { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } 
from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RegistroPendente } from '../navigation/AppStack';
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function RegistroScreen({ navigation, route }: Props){  
  const { salvos = [], setSalvos = () => {} } = route.params || {};

  const [conhecimento, setConhecimento] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [horarioDeslacre, setHorarioDeslacre] = useState(new Date());
  const [horarioInicio, setHorarioInicio] = useState(new Date());
  const [horarioFim, setHorarioFim] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"deslacre" | "inicio" | "fim" | null>(null);

  const formatHora = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  const openPicker = (target: "deslacre" | "inicio" | "fim") => {
    setPickerTarget(target);
    setShowPicker(true);
  };

  const onChangeHora = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    if (!selectedDate) return;

    switch (pickerTarget) {
      case "deslacre": setHorarioDeslacre(selectedDate); break;
      case "inicio": setHorarioInicio(selectedDate); break;
      case "fim": setHorarioFim(selectedDate); break;
    }

    setShowPicker(false);
  };

  const handleContinuar = () => {
    if (!conhecimento || !quantidade) {
      Alert.alert("Atenção", "Preencha todos os campos antes de continuar");
      return;
    }
    const id = Math.random().toString();
    navigation.navigate('Fotos', { id, conhecimento, quantidade, horarioDeslacre, horarioInicio, horarioFim, salvos, setSalvos });
  };

  const handleSalvar = () => {
    const novoRegistro: RegistroPendente = {
      id: Math.random().toString(),
      conhecimento,
      quantidade,
      horarioDeslacre,
      horarioInicio,
      horarioFim,
      descricao: '',
      imagens: [],
      ultimaTela: 'Registro',
    };
    const atualizados = [...salvos, novoRegistro];
    setSalvos(atualizados);
    navigation.navigate('Home', { salvos: atualizados, setSalvos });
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Registre a Avaria de um Ativo</Text>

          <Text style={styles.label}>Conhecimento</Text>
          <TextInput
            placeholder="Digite o conhecimento"
            placeholderTextColor="#94A3B8"
            value={conhecimento}
            onChangeText={t => setConhecimento(t.replace(/[^a-zA-Z0-9]/g, ""))}
            style={[estilosGlobais.input, styles.input]}
          />

          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            placeholder="Digite a quantidade de ocorrências"
            placeholderTextColor="#94A3B8"
            value={quantidade}
            onChangeText={t => setQuantidade(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            style={[estilosGlobais.input, styles.input]}
          />

          <Text style={styles.label}>Horário de Deslacramento</Text>
          <TouchableOpacity onPress={() => openPicker("deslacre")} style={styles.input}>
            <Text style={{ color: '#000' }}>{formatHora(horarioDeslacre)}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Horário de Início</Text>
          <TouchableOpacity onPress={() => openPicker("inicio")} style={styles.input}>
            <Text style={{ color: '#000' }}>{formatHora(horarioInicio)}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Horário de Fim</Text>
          <TouchableOpacity onPress={() => openPicker("fim")} style={styles.input}>
            <Text style={{ color: '#000' }}>{formatHora(horarioFim)}</Text>
          </TouchableOpacity>

          {showPicker && pickerTarget && (
            <DateTimePicker
              value={pickerTarget === "deslacre" ? horarioDeslacre : pickerTarget === "inicio" ? horarioInicio : horarioFim}
              mode="time"
              display="spinner"
              is24Hour
              onChange={onChangeHora}
            />
          )}

          <View style={styles.botaoContainer}>
            <Botao label="Salvar" onPress={handleSalvar} tipo="secundario"/>
            <Botao label="Continuar" onPress={handleContinuar}/>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
 scrollContainer: { 
    flexGrow: 1,

    backgroundColor: '#0F172A', 
  },
  container: { flex:1, padding:20, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center', width: '100%'},
  card: { 
    width: '100%', 
    backgroundColor: cores.card, 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width:0, height:5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  titulo: { color: cores.titulo, fontSize:22, fontWeight:'700', marginBottom: 20, textAlign:'center' },
  label: { color:cores.subtitulo, alignSelf:'flex-start', fontWeight:'600', marginTop:15, marginBottom:5 },
  input: { width:'100%', backgroundColor:'#F8FAFC', borderRadius:12, paddingVertical:14, paddingHorizontal:16, fontSize:16, color:'#000', marginBottom:12 },
  botaoContainer: { flexDirection:'row', justifyContent:'space-between', marginTop:20, width:'100%' },
});
