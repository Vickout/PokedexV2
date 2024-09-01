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

  return (
    <View style={styles.progressBarContainer}>
      <ThemedText style={styles.stat}>{name}</ThemedText>
      <ThemedText>{base_stat}</ThemedText>
      <View style={styles.progressBarFull}>
        <View
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
