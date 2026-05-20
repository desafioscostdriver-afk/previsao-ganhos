import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface IPGaugeProps {
  value: number;
}

export default function IPGauge({ value }: IPGaugeProps) {
  const colors = useColors();

  const clampedValue = Math.min(Math.max(value, 0), 2);
  const fillPercent = Math.min(clampedValue / 1.5, 1);

  let statusColor = colors.destructive;
  let statusLabel = "Abaixo do ideal";
  let statusEmoji = "";

  if (value >= 1.0) {
    statusColor = colors.success;
    statusLabel = "Produtividade boa";
    statusEmoji = "";
  } else if (value >= 0.8) {
    statusColor = colors.warning;
    statusLabel = "Produtividade razoável";
    statusEmoji = "";
  }

  const getBarColor = (index: number) => {
    const threshold = index / 10;
    if (fillPercent >= threshold) return statusColor;
    return colors.secondary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.mutedForeground }]}>Índice de Produtividade</Text>
        <Text style={[styles.value, { color: statusColor }]}>
          {value.toFixed(2)}
        </Text>
      </View>
      <View style={styles.barContainer}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              { backgroundColor: getBarColor(i), borderRadius: i === 0 ? 4 : i === 9 ? 4 : 2 },
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>0</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>1.5+</Text>
      </View>
      <Text style={[styles.referenceText, { color: colors.mutedForeground }]}>
        IP ideal = 1.0 · {value < 1.0 ? `${((1 - value) * 100).toFixed(0)}% abaixo` : `${((value - 1) * 100).toFixed(0)}% acima`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  value: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  barContainer: {
    flexDirection: "row",
    gap: 4,
    height: 12,
  },
  bar: {
    flex: 1,
    height: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  referenceText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
