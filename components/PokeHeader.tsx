import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type PokeHeaderProps = {
  title: string;
};

export default function PokeHeader({ title }: PokeHeaderProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons size={24} name="chevron-back" style={styles.backIcon} />
      </TouchableOpacity>
      <ThemedText type="subtitle">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  backIcon: {
    color: "#808080",
  },
});
