import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface TimeSelectorProps {
  label: string;
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
}

export default function TimeSelector({
  label,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: TimeSelectorProps) {
  const colors = useColors();

  const incrementHour = () => onHourChange((hour + 1) % 24);
  const decrementHour = () => onHourChange((hour - 1 + 24) % 24);
  const incrementMinute = () => {
    if (minute + 5 >= 60) {
      onMinuteChange(0);
    } else {
      onMinuteChange(minute + 5);
    }
  };
  const decrementMinute = () => {
    if (minute - 5 < 0) {
      onMinuteChange(55);
    } else {
      onMinuteChange(minute - 5);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.picker, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <View style={styles.unit}>
          <TouchableOpacity onPress={incrementHour} style={styles.btn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="chevron-up" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.digit, { color: colors.foreground }]}>{pad(hour)}</Text>
          <TouchableOpacity onPress={decrementHour} style={styles.btn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="chevron-down" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.colon, { color: colors.mutedForeground }]}>:</Text>
        <View style={styles.unit}>
          <TouchableOpacity onPress={incrementMinute} style={styles.btn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="chevron-up" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.digit, { color: colors.foreground }]}>{pad(minute)}</Text>
          <TouchableOpacity onPress={decrementMinute} style={styles.btn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="chevron-down" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  unit: {
    alignItems: "center",
    gap: 4,
    width: 40,
  },
  digit: {
    fontSize: 26,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 32,
  },
  colon: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  btn: {
    padding: 2,
  },
});
