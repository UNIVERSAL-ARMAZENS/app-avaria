import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, ScrollView, 
  TouchableOpacity, Image, Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Botao from "../components/Botao";
import { cores, estilosGlobais } from "../styles/theme";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import Signature from 'react-native-signature-canvas';
import { RegistroPendente } from '../navigation/AppStack';
 
type Props = NativeStackScreenProps<RootStackParamList, 'Fotos'>;

export default function FotosScreen({ navigation, route }: Props) {
  const { conhecimento, quantidade, horarioDeslacre, horarioInicio, horarioFim, salvos, setSalvos } = route.params;

  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  const handleSalvar = () => {
  if (!setSalvos || !salvos) return;

  const registroAtual: RegistroPendente = {
    id: Math.random().toString(),
    conhecimento,
    quantidade,
    horarioDeslacre,
    horarioInicio,
    horarioFim,
    descricao,
    imagens,
    ultimaTela: 'Fotos',
  };

  const existe = salvos.find(r => r.id === registroAtual.id);
  let novosSalvos: RegistroPendente[];

  if (existe) {
    novosSalvos = salvos.map(r => r.id === registroAtual.id ? registroAtual : r);
  } else {
    novosSalvos = [...salvos, registroAtual];
  }

  setSalvos(novosSalvos);

  navigation.navigate('Salvos', { salvos: novosSalvos, setSalvos: setSalvos });
};


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

  // Assinatura
  const handleOK = (signature: string) => {
    setAssinatura(signature); 
    setShowSignature(false);
  };
  
  const handleClear = () => {
    setAssinatura(null);
  };

  // Gerar PDF
  const gerarPDF = async () => {
    if (!descricao && imagens.length === 0) {
      Alert.alert("Erro", "Adicione descrição ou imagens antes de finalizar");
      return;
    }


    const base64Images = await Promise.all(
      imagens.map(async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        return `data:image/jpeg;base64,${base64}`;
      })
    );

    const html = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:20px;">
    <img src="https://raw.githubusercontent.com/UNIVERSAL-ARMAZENS/app-avaria/main/AppAvaria/frontend/assets/logo.png" style="height:50px;" />
    <h1 style="margin:5px 0;">Relatório de Avaria</h1>
  </div>

  <h2>Informações do Registro</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom:20px;">
    <tr>
      <td style="padding:5px; font-weight:bold;">Conhecimento:</td>
      <td style="padding:5px;">${conhecimento}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Quantidade:</td>
      <td style="padding:5px;">${quantidade}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Horário Deslacre:</td>
      <td style="padding:5px;">${horarioDeslacre.toLocaleTimeString()}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Horário Início:</td>
      <td style="padding:5px;">${horarioInicio.toLocaleTimeString()}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Horário Fim:</td>
      <td style="padding:5px;">${horarioFim.toLocaleTimeString()}</td>
    </tr>
  </table>

  <h2>Descrição da Ocorrência</h2>
  <p style="text-align:justify; margin-bottom:20px;">${descricao}</p>

  <h2>Fotos Anexadas</h2>
  <div style="display:flex; flex-wrap:wrap; gap:10px;">
    ${base64Images.map(b64 => `<img src="${b64}" style="width:200px; border-radius:5px;" />`).join('')}
  </div>

  ${assinatura ? `<h2>Assinatura:</h2><img src="${assinatura}" style="width:300px; height:100px;"/>` : ''}

  <div style="margin-top:30px; border-top:1px solid #000; padding-top:10px; text-align:right;">
    <span>Gerado em: ${new Date().toLocaleString()}</span>
  </div>
</div>
`;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Erro ao gerar PDF", String(err));
    }
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
          style={[estilosGlobais.input, styles.descricaoInput, { backgroundColor: cores.inputFundo, color: 'black' }]}
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
        <TouchableOpacity
          onPress={() => {
            setAssinatura(null); // limpa assinatura atual
            setShowSignature(true); // abre canvas para refazer ou adicionar
          }}
          style={[styles.botaoArquivo, { alignSelf: 'flex-start', marginBottom: 20 }]}
        >
          <Text style={styles.botaoTexto}>
            {assinatura ? "Refazer Assinatura" : "Adicionar Assinatura"}
          </Text>
        </TouchableOpacity>

        {showSignature && (
          <View style={{ width: '100%', height: 300, marginBottom: 20 }}>
            <Signature
              onOK={handleOK}
              onEmpty={() => console.log("canvas vazio")}
              descriptionText="Assine abaixo"
              onClear={handleClear}
              confirmText="Salvar"
              webStyle={`.m-signature-pad {box-shadow: none; border: 1px solid #000;}`}
            />
          </View>
        )}
       

        <View style={styles.previewContainer}>
          {imagens.map((uri, i) => (
            <View key={i} style={styles.previewWrapper}>
              <Image source={{ uri }} style={styles.previewImage} />
              <View style={styles.previewButtons}>
                <TouchableOpacity 
                  style={styles.miniBotao} 
                  onPress={() => setImagens(prev => prev.filter((_, index) => index !== i))}
                >
                  <Text style={styles.miniBotaoTexto}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.miniBotao} 
                  onPress={takePhoto} // refazer
                >
                  <Text style={styles.miniBotaoTexto}>Refazer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.botaoContainer}>
          <Botao label="Finalizar" onPress={gerarPDF} tipo="secundario" />
          <Botao label="Salvar" onPress={handleSalvar} />
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
  botaoContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, width: '100%' },
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
});
