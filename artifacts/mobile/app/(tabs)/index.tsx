import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import TimeSelector from "@/components/TimeSelector";
import CategorySelector from "@/components/CategorySelector";
import DateNavigator from "@/components/DateNavigator";
import { calculatePrediction, formatCurrency, formatHours } from "@/utils/calculations";
import type { PredictionResult } from "@/utils/calculations";
import type { Category } from "@/constants/data";

export default function PredictionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [category, setCategory] = useState<Category>("X");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleCalculate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const r = calculatePrediction(
      startHour,
      startMinute,
      endHour,
      endMinute,
      category,
      date.getDay()
    );
    setResult(r);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 16 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Previsão de Ganhos</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Estime quanto você pode ganhar antes de sair
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <DateNavigator date={date} onDateChange={setDate} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Horário</Text>
        <View style={styles.timeRow}>
          <TimeSelector
            label="Início"
            hour={startHour}
            minute={startMinute}
            onHourChange={setStartHour}
            onMinuteChange={setStartMinute}
          />
          <View style={styles.timeDivider}>
            <Feather name="arrow-right" size={20} color={colors.mutedForeground} />
          </View>
          <TimeSelector
            label="Fim"
            hour={endHour}
            minute={endMinute}
            onHourChange={setEndHour}
            onMinuteChange={setEndMinute}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <CategorySelector selected={category} onSelect={setCategory} />
      </View>

      <TouchableOpacity
        style={[styles.calcButton, { backgroundColor: colors.primary }]}
        onPress={handleCalculate}
        activeOpacity={0.85}
      >
        <Feather name="trending-up" size={18} color={colors.primaryForeground} />
        <Text style={[styles.calcButtonText, { color: colors.primaryForeground }]}>
          Calcular Previsão
        </Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultsContainer}>
          <View style={[styles.resultMain, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
              Faixa de ganhos estimada
            </Text>
            <Text style={[styles.resultDuration, { color: colors.mutedForeground }]}>
              {formatHours(result.totalHours)} de trabalho
            </Text>
            <View style={styles.rangeRow}>
              <View style={styles.rangeItem}>
                <Text style={[styles.rangeLabel, { color: colors.mutedForeground }]}>Mínimo</Text>
                <Text style={[styles.rangeValue, { color: colors.warning }]}>
                  {formatCurrency(result.totalMin)}
                </Text>
                <Text style={[styles.rangeAvgLabel, { color: colors.mutedForeground }]}>
                  média/h
                </Text>
                <Text style={[styles.rangeAvgValue, { color: colors.warning }]}>
                  {formatCurrency(result.avgMinPerHour)}
                </Text>
              </View>
              <View style={[styles.rangeSep, { backgroundColor: colors.border }]} />
              <View style={styles.rangeItem}>
                <Text style={[styles.rangeLabel, { color: colors.mutedForeground }]}>Máximo</Text>
                <Text style={[styles.rangeValue, { color: colors.success }]}>
                  {formatCurrency(result.totalMax)}
                </Text>
                <Text style={[styles.rangeAvgLabel, { color: colors.mutedForeground }]}>
                  média/h
                </Text>
                <Text style={[styles.rangeAvgValue, { color: colors.success }]}>
                  {formatCurrency(result.avgMaxPerHour)}
                </Text>
              </View>
            </View>
          </View>

          {result.dayMultiplierApplied > 1 && (
            <View style={[styles.noticeCard, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
              <Feather name="info" size={14} color={colors.warning} />
              <Text style={[styles.noticeText, { color: colors.warning }]}>
                Multiplicador de fim de semana ×{result.dayMultiplierApplied.toFixed(3)} aplicado
              </Text>
            </View>
          )}

          <View style={[styles.legendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.legendText, { color: colors.success }]}>
                Valor máximo: aproximadamente{" "}
                <Text style={styles.legendBold}>
                  {Math.round(3.4 * result.totalHours)} corridas
                </Text>
              </Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: colors.destructive }]} />
              <Text style={[styles.legendText, { color: colors.destructive }]}>
                Valor mínimo: abaixo de{" "}
                <Text style={styles.legendBold}>
                  {Math.round(2.0 * result.totalHours)} corridas
                </Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        Desenvolvido por Nexor-tec — 2026
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeDivider: {
    paddingTop: 16,
  },
  calcButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
  },
  calcButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  resultsContainer: {
    gap: 10,
    marginTop: 4,
  },
  resultMain: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 6,
  },
  resultLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  resultDuration: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rangeItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  rangeLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  rangeValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  rangeAvgLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  rangeAvgValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  rangeSep: {
    width: 1,
    height: 80,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  noticeText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  legendCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  legendBold: {
    fontFamily: "Inter_700Bold",
  },
  footer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.5,
  },
});
