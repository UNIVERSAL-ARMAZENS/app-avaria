import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Signature from "react-native-signature-canvas";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import { cores } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, 'Ass'>;

export default function AssScreen({ route }: Props) {
  const { conhecimento, quantidade, horarioDeslacre, horarioInicio, horarioFim, descricao, imagens } = route.params;

  // Converte para Date
  const horarioDeslacreDate = new Date(horarioDeslacre);
  const horarioInicioDate = new Date(horarioInicio);
  const horarioFimDate = new Date(horarioFim);

  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  const handleOK = (sig: string) => {
    setAssinatura(sig);
    setShowSignature(false);
  };

  const handleClear = () => setAssinatura(null);

  const gerarPDF = async () => {
    if (!descricao && imagens.length === 0) {
      Alert.alert("Erro", "Adicione descrição ou imagens antes de finalizar");
      return;
    }

    // Converte imagens para base64
    const base64Images = await Promise.all(
      imagens.map(async (uri) => {
        const b64 = await fetch(uri)
          .then(r => r.blob())
          .then(blob => new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result as string);
            reader.readAsDataURL(blob);
          }));
        return b64;
      })
    );

    // HTML do PDF
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
      <td style="padding:5px;">${horarioDeslacreDate.toLocaleTimeString()}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Horário Início:</td>
      <td style="padding:5px;">${horarioInicioDate.toLocaleTimeString()}</td>
    </tr>
    <tr>
      <td style="padding:5px; font-weight:bold;">Horário Fim:</td>
      <td style="padding:5px;">${horarioFimDate.toLocaleTimeString()}</td>
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => { setShowSignature(true); setAssinatura(null); }}
        style={styles.botao}
      >
        <Text style={styles.botaoTexto}>
          {assinatura ? "Refazer Assinatura" : "Adicionar Assinatura"}
        </Text>
      </TouchableOpacity>

      {showSignature && (
        <Signature
          onOK={handleOK}
          onEmpty={() => console.log("canvas vazio")}
          onClear={handleClear}
          descriptionText="Assine abaixo"
          confirmText="Salvar"
          webStyle=".m-signature-pad {box-shadow: none; border: 1px solid #000;}"
          style={{ width: '100%', height: 300 }}
        />
      )}

      <TouchableOpacity onPress={gerarPDF} style={[styles.botao, { marginTop: 20 }]}>
        <Text style={styles.botaoTexto}>Gerar PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: cores.fundo },
  botao: { backgroundColor: cores.secundario, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});
