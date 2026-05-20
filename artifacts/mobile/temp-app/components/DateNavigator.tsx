import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { DAY_NAMES, DAY_MULTIPLIERS } from "@/constants/data";

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const colors = useColors();
  const dayOfWeek = date.getDay();
  const dayMultiplier = DAY_MULTIPLIERS[dayOfWeek] ?? 1.0;
  const isWeekend = dayMultiplier > 1.0;

  const goBack = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const goForward = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  };

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.arrow} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Feather name="chevron-left" size={22} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={[styles.dateText, { color: colors.foreground }]}>
          {DAY_NAMES[dayOfWeek]}, {formattedDate}
        </Text>
        {isToday && (
          <View style={[styles.todayBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.todayText, { color: colors.primary }]}>hoje</Text>
          </View>
        )}
        {isWeekend && (
          <View style={[styles.weekendBadge, { backgroundColor: colors.warning + "20" }]}>
            <Text style={[styles.weekendText, { color: colors.warning }]}>
              ×{dayMultiplier.toFixed(3)} fim de semana
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={goForward} style={styles.arrow} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Feather name="chevron-right" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    padding: 4,
  },
  center: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  weekendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weekendText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
