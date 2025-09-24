import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, ScrollView, 
  TouchableOpacity, Image, Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";
import { RootStackParamList } from '../navigation/AppStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';




type Props = NativeStackScreenProps<RootStackParamList, 'Fotos'>;

export default function FotosScreen({ navigation }: Props){  
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

const handleContinuar = () => {
    navigation.navigate("Registro");
  };
  // Abrir galeria
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

  // Abrir câmera
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

  const handleSalvar = () => {
    Alert.alert(
      "Salvando...",
      `Descrição: ${descricao}\nArquivos anexados: ${imagens.length}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.titulo}>Nova Descrição / Avaria</Text>

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          placeholder="Digite a descrição detalhada"
          placeholderTextColor={cores.placeholder}
          value={descricao}
          onChangeText={setDescricao}
          style={[estilosGlobais.input, styles.descricaoInput]}
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
            <Image key={i} source={{ uri }} style={styles.previewImage} />
          ))}
        </View>

        <Botao label="Salvar" onPress={handleSalvar} />
        <Botao label="Continuar" onPress={handleContinuar} tipo="secundario" />
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 50 },
  container: { flex: 1, padding: 20, backgroundColor: cores.fundo },
  titulo: { color: cores.branco, fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginBottom: 5, color: cores.branco },
  descricaoInput: { height: 150, textAlignVertical: "top", padding: 10, marginBottom: 15, borderRadius: 8 },
  botoesArquivos: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  botaoArquivo: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: cores.secundario, borderRadius: 8, gap: 5 },
  botaoTexto: { color: "white", fontWeight: "600" },
  previewContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  previewImage: { width: 120, height: 120, borderRadius: 8, marginBottom: 10 },
});
