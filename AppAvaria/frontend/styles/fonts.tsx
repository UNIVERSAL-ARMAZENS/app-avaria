import React from "react";
import { Text, TextProps, ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

type TextoProps = TextProps & {
  bold?: boolean;
};

export default function Texto({ bold, style, children, ...rest }: TextoProps) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <Text
      style={[{ fontFamily: bold ? "Inter_700Bold" : "Inter_400Regular" }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
