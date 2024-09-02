import { ColorValue, DimensionValue, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import * as React from "react";

type StatProgressBarProps = {
  base_stat: number;
  name: string;
  color: ColorValue;
};

export function StatProgressBar({
  base_stat,
  name,
  color,
}: StatProgressBarProps) {
  const percentage = React.useMemo(() => {
    return `${(base_stat / 255) * 100}%` as DimensionValue;
  }, [base_stat]);

  const statLabel = React.useMemo(() => {
    switch (name) {
      case "hp":
        return "HP";
      case "attack":
        return "ATK";
      case "defense":
        return "DEF";
      case "special-attack":
        return "SATK";
      case "special-defense":
        return "SDEF";
      case "speed":
        return "SPD";

      default:
        break;
    }
  }, [name]);

  return (
    <View style={styles.progressBarContainer}>
      <ThemedText style={styles.stat}>{statLabel}</ThemedText>
      <ThemedText style={styles.statValue}>{base_stat}</ThemedText>
      <View style={styles.progressBarFull}>
        <View
          testID="progress-bar"
          style={[
            styles.progressBar,
            { width: percentage, backgroundColor: color },
          ]}
        />
      </View>
      <ThemedText>255</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    marginRight: 15,
    width: 45,
    fontWeight: "700",
  },
  statValue: {
    width: 30,
  },
  progressBarFull: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#b8b8b8",
    marginHorizontal: 8,
  },
  progressBar: {
    flex: 1,
    borderRadius: 5,
  },
});
