import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";

export default function RegistroScreen() {
  const [ativo, setAtivo] = useState("");
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

    if (Platform.OS === "android") setShowPicker(false);
  };

  const handleContinuar = () => {
    alert("Continuar pressionado!");
  };

  const handleSalvar = () => {
    alert(
      `Ativo: ${ativo}\nQuantidade: ${quantidade}\n` +
      `Deslacramento: ${formatHora(horarioDeslacre)}\n` +
      `Início: ${formatHora(horarioInicio)}\nFim: ${formatHora(horarioFim)}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registre a Avaria de um Ativo</Text>

      <Text style={styles.label}>Ativo:</Text>
      <TextInput
        placeholder="Digite o ativo"
        placeholderTextColor={cores.placeholder}
        value={ativo}
        onChangeText={t => setAtivo(t.replace(/[^a-zA-Z0-9]/g, ""))}
        style={[
            estilosGlobais.input, 
            { 
              width: '100%', 
              backgroundColor: cores.inputFundo, 
              color: 'black'  // muda a cor do texto digitado
            }
          ]}
        />

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        placeholder="Digite a quantidade"
        placeholderTextColor={cores.placeholder}
        value={quantidade}
        onChangeText={t => setQuantidade(t.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        style={[
              estilosGlobais.input, 
              { 
                width: '100%', 
                backgroundColor: cores.inputFundo, 
                color: 'black'  // muda a cor do texto digitado
              }
            ]}
          />

      <Text style={styles.label}>Horário de Deslacramento:</Text>
      <TextInput
        value={formatHora(horarioDeslacre)}
        onFocus={() => openPicker("deslacre")}
        style={[
          estilosGlobais.input, 
          { 
            width: '100%', 
            backgroundColor: cores.inputFundo, 
            color: 'black'  // muda a cor do texto digitado
          }
        ]}
      />
                
      <Text style={styles.label}>Horário de Início:</Text>
      <TextInput
        value={formatHora(horarioInicio)}
        onFocus={() => openPicker("inicio")}
         style={[
              estilosGlobais.input, 
              { 
                width: '100%', 
                backgroundColor: cores.inputFundo, 
                color: 'black'  // muda a cor do texto digitado
              }
            ]}
          />

      <Text style={styles.label}>Horário de Fim:</Text>
      <TextInput
        value={formatHora(horarioFim)}
        onFocus={() => openPicker("fim")}
         style={[
            estilosGlobais.input, 
            { 
              width: '100%', 
              backgroundColor: cores.inputFundo, 
              color: 'black'  // muda a cor do texto digitado
            }
          ]}
        />

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
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeHora}
        />
      )}

      <View style={styles.botaoContainer}>
        <Botao label="Continuar" onPress={handleContinuar} tipo="secundario"  />
        <Botao label="Salvar" onPress={handleSalvar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
