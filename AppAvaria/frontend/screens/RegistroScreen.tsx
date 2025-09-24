import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } 
from "react-native";import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";
import { RegistroPendente } from '../navigation/AppStack';
type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function RegistroScreen({ navigation }: Props){  
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
      case "deslacre":
        setHorarioDeslacre(selectedDate);
        break;
      case "inicio":
        setHorarioInicio(selectedDate);
        break;
      case "fim":
        setHorarioFim(selectedDate);
        break;
    }

    setShowPicker(false);
  };

   const handleContinuar = () => {
    navigation.navigate('Fotos', {
    conhecimento,
    quantidade,
    horarioDeslacre,
    horarioInicio,
    horarioFim
  });
};

const [salvos, setSalvos] = useState<RegistroPendente[]>([]);

const handleSalvar = () => {
  const novoRegistro: RegistroPendente = {
    id: Math.random().toString(),
    conhecimento,
    quantidade,
    horarioDeslacre,
    horarioInicio,
    horarioFim,
    descricao: '', // aqui você pode adicionar depois da tela de Fotos
    imagens: [],
  };

  const atualizados = [...salvos, novoRegistro];
  setSalvos(atualizados);

  navigation.navigate('Salvos', { salvos: atualizados, setSalvos: setSalvos });
};




  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.titulo}>Registre a Avaria de um Ativo</Text>

        <Text style={styles.label}>Conhecimento:</Text>
        <TextInput
          placeholder="Digite o Conhecimento"
          placeholderTextColor={cores.placeholder}
          value={conhecimento}
          onChangeText={t => setConhecimento(t.replace(/[^a-zA-Z0-9]/g, ""))}
          style={[estilosGlobais.input, { width: '100%', backgroundColor: cores.inputFundo, color: 'black' }]}
        />

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          placeholder="Digite a quantidade de ocorrências"
          placeholderTextColor={cores.placeholder}
          value={quantidade}
          onChangeText={t => setQuantidade(t.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          style={[estilosGlobais.input, { width: '100%', backgroundColor: cores.inputFundo, color: 'black' }]}
        />

        <Text style={styles.label}>Horário de Deslacramento:</Text>
        <TouchableOpacity
          onPress={() => openPicker("deslacre")}
          style={[estilosGlobais.input, { width: '100%', backgroundColor: cores.inputFundo }]}
        >
          <Text style={{ color: 'black' }}>{formatHora(horarioDeslacre)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Horário de Início:</Text>
        <TouchableOpacity
          onPress={() => openPicker("inicio")}
          style={[estilosGlobais.input, { width: '100%', backgroundColor: cores.inputFundo}]}
        >
          <Text style={{ color: 'black' }}>{formatHora(horarioInicio)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Horário de Fim:</Text>
        <TouchableOpacity
          onPress={() => openPicker("fim")}
          style={[estilosGlobais.input, { width: '100%', backgroundColor: cores.inputFundo}]}
        >
          <Text style={{ color: 'black' }}>{formatHora(horarioFim)}</Text>
        </TouchableOpacity>

        {showPicker && pickerTarget && (
          <DateTimePicker
            value={
              pickerTarget === "deslacre"
                ? horarioDeslacre
                : pickerTarget === "inicio"
                ? horarioInicio
                : horarioFim
            }
            mode="time"
            display="spinner"
            is24Hour
            onChange={onChangeHora}
          />
        )}

        <View style={styles.botaoContainer}>
          <Botao label="Continuar" onPress={handleContinuar} tipo="secundario" />
          <Botao label="Salvar" onPress={handleSalvar} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40, // garante espaço para os botões
  },
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: { 
    fontWeight: "bold", 
    marginTop: 15,
    color: cores.branco,
    alignSelf: 'flex-start',
  },
  titulo: {
    color: cores.branco,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
    fontWeight: '700',
  },
  botaoContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 30,
    width: '100%',
  },
});
