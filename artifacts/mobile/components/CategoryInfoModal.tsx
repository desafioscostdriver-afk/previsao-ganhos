import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface CategoryInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORY_INFO = [
  {
    key: "x",
    label: "X / 99 Pop",
    color: "#3B82F6",
    bgColor: "#3B82F620",
    borderColor: "#3B82F640",
    icon: "smartphone" as const,
    rule: "A maioria das corridas (mais de 50%) são X ou 99 Pop.",
    tip: null,
    badge: "> 50% corridas X",
  },
  {
    key: "confort",
    label: "Confort / 99 Plus",
    color: "#00D4AA",
    bgColor: "#00D4AA20",
    borderColor: "#00D4AA40",
    icon: "star" as const,
    rule: "Pelo menos metade das corridas (≥ 50%) são Confort ou 99 Plus.",
    tip: "Corridas X com surge pricing de ± R$3,00 se equiparam ao Confort e podem ser contadas.",
    badge: "≥ 50% corridas Confort",
  },
  {
    key: "black",
    label: "Black",
    color: "#F59E0B",
    bgColor: "#F59E0B20",
    borderColor: "#F59E0B40",
    icon: "award" as const,
    rule: "Pelo menos 1/3 das corridas (≥ 33%) são Black.",
    tip: "Corridas Confort com surge pricing de ± R$5,00 se equiparam ao Black e podem ser contadas.",
    badge: "≥ 33% corridas Black",
  },
];

export default function CategoryInfoModal({ visible, onClose }: CategoryInfoModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                marginBottom: Platform.OS === "web" ? 34 : insets.bottom + 8,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.headerIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Feather name="info" size={16} color={colors.accent} />
                </View>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  Como escolher a categoria
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.intro, { color: colors.mutedForeground }]}>
              Escolha a categoria que representa a maior parte das suas corridas na jornada analisada.
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {CATEGORY_INFO.map((cat) => (
              <View
                key={cat.key}
                style={[
                  styles.catCard,
                  { backgroundColor: cat.bgColor, borderColor: cat.borderColor },
                ]}
              >
                <View style={styles.catHeader}>
                  <View style={[styles.catIconWrap, { backgroundColor: cat.color + "30" }]}>
                    <Feather name={cat.icon} size={18} color={cat.color} />
                  </View>
                  <View style={styles.catTitleGroup}>
                    <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
                    <View style={[styles.badge, { backgroundColor: cat.color + "25" }]}>
                      <Text style={[styles.badgeText, { color: cat.color }]}>{cat.badge}</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.catRule, { color: colors.foreground }]}>{cat.rule}</Text>
                {cat.tip && (
                  <View style={[styles.tipRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <Feather name="zap" size={12} color={cat.color} />
                    <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{cat.tip}</Text>
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={[styles.doneBtnText, { color: colors.primaryForeground }]}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
  },
  sheet: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 14,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  intro: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
  catCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  catTitleGroup: {
    flex: 1,
    gap: 4,
  },
  catLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  catRule: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 18,
  },
  doneBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },
  doneBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
