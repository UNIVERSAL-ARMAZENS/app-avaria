import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, ScrollView, 
  TouchableOpacity, Image, Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RegistroPendente } from '../navigation/AppStack';
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, 'Fotos'>;

export default function FotosScreen({ navigation, route }: Props) {
  const { salvos = [], setSalvos = () => {} } = route.params || {};

  const { conhecimento, quantidade, horarioDeslacre, horarioInicio, horarioFim } = route.params;

  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

  // Seleciona imagens da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Não foi possível acessar a galeria");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setImagens(prev => [...prev, ...uris]);
    }
  };

  // Tirar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Não foi possível usar a câmera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImagens(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleFinalizar = () => {
    if (!descricao && imagens.length === 0) {
      Alert.alert("Atenção", "Adicione descrição ou fotos antes de continuar");
      return;
    }

    // Navega para AssScreen passando todos os dados do registro
    navigation.navigate('Ass', {
      conhecimento,
      quantidade,
      horarioDeslacre,
      horarioInicio,
      horarioFim,
      descricao,
      imagens,
    });
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
    ultimaTela: 'Fotos',
  };

  const atualizados = [...salvos, novoRegistro];
  setSalvos(atualizados);

    navigation.navigate('Home', { salvos: atualizados, setSalvos });
};
  return (
  <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <Text style={styles.titulo}>Ocorrências / Avaria</Text>

      <Text style={styles.label}>Descrição das Ocorrências:</Text>
      <TextInput
        placeholder="Digite as Ocorrências Verificadas"
        placeholderTextColor={cores.placeholder}
        value={descricao}
        onChangeText={setDescricao}
        style={[
          estilosGlobais.input,
          styles.descricaoInput,
          { backgroundColor: cores.inputFundo, color: "black" }
        ]}
        multiline
      />

      <Text style={styles.label}>Anexos:</Text>
      <View style={styles.botoesArquivos}>
        <TouchableOpacity style={styles.botaoArquivo} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="white" />
          <Text style={styles.botaoTexto}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoArquivo} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color="white" />
          <Text style={styles.botaoTexto}>Câmera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {imagens.map((uri, i) => (
          <View key={i} style={styles.previewWrapper}>
            <Image source={{ uri }} style={styles.previewImage} />
            <View style={styles.previewButtons}>
              <TouchableOpacity
                style={styles.miniBotao}
                onPress={() =>
                  setImagens(prev => prev.filter((_, index) => index !== i))
                }
              >
                <Text style={styles.miniBotaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.botaoContainer}>
             <Botao label="Salvar" onPress={handleSalvar} tipo="secundario" />
          <Botao label="Continuar" onPress={handleFinalizar} />
        </View>
      </View>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  container: { flex: 1, padding: 20, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'flex-start' },
  label: { fontWeight: "bold", marginTop: 15, color: cores.branco, alignSelf: 'flex-start' },
  titulo: { color: cores.branco, fontSize: 20, textAlign: 'center', marginTop: 50, marginBottom: 30, fontWeight: '700' },
  descricaoInput: { height: 150, textAlignVertical: "top", padding: 10, marginBottom: 15, borderRadius: 8, width: '100%' },
  botoesArquivos: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  botaoArquivo: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: cores.secundario, borderRadius: 8, gap: 5 },
  botaoTexto: { color: "white", fontWeight: "600" },
  previewContainer: { width: '100%' },
  previewWrapper: { marginBottom: 20 },
  previewImage: { width: '100%', height: 200, borderRadius: 8 },
  previewButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  miniBotao: { flex: 1, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: cores.secundario, borderRadius: 6, alignItems: 'center', marginHorizontal: 5 },
  miniBotaoTexto: { color: '#fff', fontSize: 12, fontWeight: '600' },
  botaoContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30,width: '100%',},
});
