import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export default function PokeInput({
  value,
  onChangeText,
  ...rest
}: TextInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons size={24} name="search" style={styles.searchIcon} />
      <TextInput
        placeholder="Buscar pokémon..."
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: "#8a8886",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    color: "#808080",
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
});
