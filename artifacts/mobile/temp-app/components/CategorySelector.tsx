import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Category, CATEGORY_LABELS } from "@/constants/data";

interface CategorySelectorProps {
  selected: Category;
  onSelect: (cat: Category) => void;
}

const CATEGORIES: Category[] = ["X", "Confort", "Black"];

export default function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>Categoria</Text>
      <View style={[styles.row, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.option,
                isSelected && { backgroundColor: colors.primary },
              ]}
              onPress={() => onSelect(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: isSelected ? colors.primaryForeground : colors.mutedForeground },
                ]}
                numberOfLines={1}
              >
                {cat === "X" ? "X / Pop" : cat === "Confort" ? "Confort" : "Black"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.sublabel, { color: colors.mutedForeground }]}>
        {CATEGORY_LABELS[selected]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  sublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
