import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { cores, estilosGlobais } from "../styles/theme";

type BotaoProps = {
  label: string;
  onPress: () => void;
  tipo?: "primario" | "secundario";
};

export default function Botao({ label, onPress, tipo = "primario" }: BotaoProps) {
  return (
    <TouchableOpacity
      style={[
        estilosGlobais.botao,
        { backgroundColor: tipo === "primario" ? cores.primario : cores.secundario },
        Platform.OS === "web" && { cursor: "pointer" }
      ]}
      onPress={onPress}
    >
      <Text style={{ color: cores.branco, fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
