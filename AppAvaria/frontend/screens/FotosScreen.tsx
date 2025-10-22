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
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Ocorrências / Avaria</Text>

          <Text style={styles.label}>Descrição das Ocorrências:</Text>
          <TextInput
            placeholder="Digite as Ocorrências Verificadas"
            placeholderTextColor="#94A3B8"
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1,
    padding: 24,
    paddingBottom: 50,
    backgroundColor: '#0F172A', 
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 32,
    padding: 32,
    marginTop: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    minHeight: '80%',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 14,
    marginBottom: 6,
  },
  descricaoInput: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
    color: '#0F172A',
    fontSize: 16,
  },
  botoesArquivos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
    gap: 12,
  },
  botaoArquivo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  previewContainer: {
    width: '100%',
    marginTop: 18,
  },
  previewWrapper: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 6,
    backgroundColor: '#1E293B',
  },
  miniBotao: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  miniBotaoTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 28,
  },
});
