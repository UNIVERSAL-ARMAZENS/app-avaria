import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegistroScreen() {
  const [ativo, setAtivo] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const [horarioDeslacre, setHorarioDeslacre] = useState(new Date());
  const [horarioInicio, setHorarioInicio] = useState(new Date());
  const [horarioFim, setHorarioFim] = useState(new Date());

  const [showPicker, setShowPicker] = useState<{field: string, visible: boolean}>({field:'', visible:false});

  // Funções de validação
  const handleAtivoChange = (text: string) => setAtivo(text.replace(/[^a-zA-Z0-9]/g, ''));
  const handleQuantidadeChange = (text: string) => setQuantidade(text.replace(/[^0-9]/g, ''));

  // Abrir picker de hora
  const openPicker = (field: 'deslacre' | 'inicio' | 'fim') => {
    setShowPicker({field, visible:true});
  };

  // Atualizar horário selecionado
  const onChangeTime = (event:any, selected?: Date) => {
    if(selected){
      if(showPicker.field === 'deslacre') setHorarioDeslacre(selected);
      if(showPicker.field === 'inicio') setHorarioInicio(selected);
      if(showPicker.field === 'fim') setHorarioFim(selected);
    }
    if(Platform.OS !== 'ios') setShowPicker({field:'', visible:false});
  };

  const formatHora = (date: Date) =>
    `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

  // Botões
  const handleContinuar = () => {
    // Navegar para tela de fotos
  };
  const handleSalvar = () => {
    // Salvar dados no backend
  };

  return (
    <View style={styles.container}>
      {/* Ativo */}
      <Text style={styles.label}>Ativo:</Text>
      <TextInput
        style={styles.input}
        value={ativo}
        onChangeText={handleAtivoChange}
        placeholder="Digite o ativo"
      />

      {/* Quantidade */}
      <Text style={styles.label}>Quantidade de Itens:</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={handleQuantidadeChange}
        keyboardType="numeric"
        placeholder="Digite a quantidade"
      />

      {/* Horários */}
      <Text style={styles.label}>Horário de Deslacramento:</Text>
      <TouchableOpacity style={styles.input} onPress={()=>openPicker('deslacre')}>
        <Text>{formatHora(horarioDeslacre)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Horário de Início:</Text>
      <TouchableOpacity style={styles.input} onPress={()=>openPicker('inicio')}>
        <Text>{formatHora(horarioInicio)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Horário de Fim:</Text>
      <TouchableOpacity style={styles.input} onPress={()=>openPicker('fim')}>
        <Text>{formatHora(horarioFim)}</Text>
      </TouchableOpacity>

      {/* Picker */}
      {showPicker.visible && (
        <DateTimePicker
          value={
            showPicker.field === 'deslacre' ? horarioDeslacre :
            showPicker.field === 'inicio' ? horarioInicio :
            horarioFim
          }
          mode="time"
          display="spinner"
          is24Hour={true}
          onChange={onChangeTime}
        />
      )}

      {/* Botões */}
      <TouchableOpacity style={styles.button} onPress={handleContinuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#f2f2f2' },
  label: { fontWeight:'bold', marginTop:15 },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12, marginTop:5, backgroundColor:'#fff' },
  button: { marginTop:20, borderRadius:8, overflow:'hidden', backgroundColor:'#007BFF' },
  buttonText: { textAlign:'center', padding:12, color:'#fff', fontWeight:'bold' },
});
