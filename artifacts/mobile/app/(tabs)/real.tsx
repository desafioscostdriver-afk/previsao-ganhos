import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import TimeSelector from "@/components/TimeSelector";
import CategorySelector from "@/components/CategorySelector";
import DateNavigator from "@/components/DateNavigator";
import IPGauge from "@/components/IPGauge";
import { calculateReal, formatCurrency, formatHours } from "@/utils/calculations";
import type { RealResult } from "@/utils/calculations";
import type { Category } from "@/constants/data";
import { getMotivationalMessage, getPerformanceLevel } from "@/constants/messages";

export default function RealScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [category, setCategory] = useState<Category>("X");
  const [earnedText, setEarnedText] = useState("");
  const [ridesText, setRidesText] = useState("");
  const [result, setResult] = useState<RealResult | null>(null);

  const handleAnalyze = () => {
    const earned = parseFloat(earnedText.replace(",", "."));
    const rides = parseInt(ridesText, 10);
    if (isNaN(earned) || isNaN(rides) || earned < 0 || rides < 0) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const r = calculateReal(
      startHour,
      startMinute,
      endHour,
      endMinute,
      earned,
      rides,
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
      <Text style={[styles.title, { color: colors.foreground }]}>Resultado Real</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Analise sua performance após a jornada
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <DateNavigator date={date} onDateChange={setDate} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Horário Trabalhado</Text>
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

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Dados da Jornada</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Total Ganho (R$)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.inputPrefix, { color: colors.mutedForeground }]}>R$</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={earnedText}
                onChangeText={setEarnedText}
                placeholder="0,00"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Total de Corridas</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={ridesText}
                onChangeText={setRidesText}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
                returnKeyType="done"
              />
              <Text style={[styles.inputSuffix, { color: colors.mutedForeground }]}>corridas</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.analyzeButton, { backgroundColor: colors.accent }]}
        onPress={handleAnalyze}
        activeOpacity={0.85}
      >
        <Feather name="bar-chart-2" size={18} color="#FFFFFF" />
        <Text style={[styles.analyzeButtonText, { color: "#FFFFFF" }]}>
          Analisar Resultado
        </Text>
      </TouchableOpacity>

      {result !== null && (() => {
        const pred = result.prediction;
        const level = pred
          ? getPerformanceLevel(
              result.earnedPerHour,
              pred.avgMinPerHour,
              pred.avgMaxPerHour,
              parseFloat(earnedText.replace(",", ".")),
              pred.totalMax,
              result.productivityIndex
            )
          : null;

        const seed = date.getDay() + (parseInt(ridesText, 10) || 0);
        const message = level ? getMotivationalMessage(level, seed) : null;

        const levelColor =
          level === "red"
            ? colors.destructive
            : level === "orange"
            ? colors.warning
            : level === "green"
            ? colors.success
            : colors.accent;

        return (
          <View style={styles.resultsContainer}>
            <IPGauge value={result.productivityIndex} />

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Horas trabalhadas</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {formatHours(result.hoursWorked)}
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Corridas/hora</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {result.ridesPerHour.toFixed(1)}<Text style={[styles.statUnit, { color: colors.mutedForeground }]}>/h</Text>
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[
                styles.statCard,
                { backgroundColor: level ? levelColor + "15" : colors.card, borderColor: level ? levelColor + "50" : colors.border },
              ]}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Ganho/hora real</Text>
                <Text style={[styles.statValue, { color: level ? levelColor : colors.foreground }]}>
                  {formatCurrency(result.earnedPerHour)}
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Meta corridas/h</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {result.idealRidesPerHour.toFixed(1)}<Text style={[styles.statUnit, { color: colors.mutedForeground }]}>/h</Text>
                </Text>
              </View>
            </View>

            {message !== null && (
              <View style={[
                styles.motivationCard,
                { backgroundColor: levelColor + "15", borderColor: levelColor + "40" },
              ]}>
                <Feather
                  name={
                    level === "atypical" ? "alert-triangle" :
                    level === "green" ? "award" :
                    level === "orange" ? "trending-up" : "info"
                  }
                  size={16}
                  color={levelColor}
                />
                <Text style={[styles.motivationText, { color: levelColor }]}>
                  {message}
                </Text>
              </View>
            )}

            {pred !== null && (
              <View style={[styles.comparisonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.comparisonTitle, { color: colors.foreground }]}>
                  Comparação com a Previsão
                </Text>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonItem}>
                    <Text style={[styles.comparisonLabel, { color: colors.mutedForeground }]}>Mínimo previsto</Text>
                    <Text style={[styles.comparisonValue, { color: colors.warning }]}>
                      {formatCurrency(pred.totalMin)}
                    </Text>
                    <Text style={[styles.comparisonAvgLabel, { color: colors.mutedForeground }]}>média/h</Text>
                    <Text style={[styles.comparisonAvgValue, { color: colors.warning }]}>
                      {formatCurrency(pred.avgMinPerHour)}
                    </Text>
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={[styles.comparisonLabel, { color: colors.mutedForeground }]}>Máximo previsto</Text>
                    <Text style={[styles.comparisonValue, { color: colors.success }]}>
                      {formatCurrency(pred.totalMax)}
                    </Text>
                    <Text style={[styles.comparisonAvgLabel, { color: colors.mutedForeground }]}>média/h</Text>
                    <Text style={[styles.comparisonAvgValue, { color: colors.success }]}>
                      {formatCurrency(pred.avgMaxPerHour)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.vsRow}>
                  <View
                    style={[
                      styles.vsBadge,
                      {
                        backgroundColor:
                          result.isAboveMin
                            ? result.isBelowMax
                              ? colors.success + "20"
                              : colors.accent + "20"
                            : colors.destructive + "20",
                      },
                    ]}
                  >
                    <Feather
                      name={result.isAboveMin ? "check-circle" : "alert-circle"}
                      size={16}
                      color={
                        result.isAboveMin
                          ? result.isBelowMax
                            ? colors.success
                            : colors.accent
                          : colors.destructive
                      }
                    />
                    <Text
                      style={[
                        styles.vsText,
                        {
                          color:
                            result.isAboveMin
                              ? result.isBelowMax
                                ? colors.success
                                : colors.accent
                              : colors.destructive,
                        },
                      ]}
                    >
                      {result.isAboveMin && result.isBelowMax
                        ? "Dentro da faixa esperada"
                        : result.isAboveMin && !result.isBelowMax
                        ? "Acima do máximo previsto"
                        : "Abaixo do mínimo previsto"}
                    </Text>
                  </View>
                </View>

                {result.vsMinDiff !== null && (
                  <Text style={[styles.diffText, { color: colors.mutedForeground }]}>
                    {result.vsMinDiff >= 0
                      ? `+${formatCurrency(result.vsMinDiff)} acima do mínimo`
                      : `${formatCurrency(result.vsMinDiff)} abaixo do mínimo`}
                  </Text>
                )}
              </View>
            )}
          </View>
        );
      })()}
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
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  inputPrefix: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  inputSuffix: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    padding: 0,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  resultsContainer: {
    gap: 10,
    marginTop: 4,
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
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  statUnit: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  comparisonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  comparisonTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  comparisonRow: {
    flexDirection: "row",
    gap: 16,
  },
  comparisonItem: {
    flex: 1,
    gap: 4,
  },
  comparisonLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  comparisonValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  comparisonAvgLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  comparisonAvgValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  motivationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  motivationText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
  vsRow: {
    alignItems: "flex-start",
  },
  vsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vsText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  diffText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
