export type PerformanceLevel = "red" | "orange" | "green" | "atypical";

const RED_MESSAGES = [
  "Dia mais difícil. Reveja os horários de pico e ajuste a estratégia amanhã.",
  "Resultado abaixo do mínimo. Cada jornada difícil é um ensinamento para a próxima.",
  "Hoje foi mais pesado. Analise quais horários trouxeram menos resultado.",
  "Abaixo do esperado. Foco nos horários certos faz toda a diferença.",
  "Dia fraco, mas não desanima — a consistência ao longo da semana é o que conta.",
];

const ORANGE_MESSAGES = [
  "Dentro da faixa! Pequenos ajustes nos horários podem te levar ao máximo.",
  "Boa jornada! Você está no caminho certo. Consistência é a chave.",
  "Resultado sólido. Manter esse ritmo já coloca você acima da média.",
  "Na faixa prevista. Um pouco mais de foco nos picos e você chega ao topo.",
  "Jornada equilibrada. Cada dia dentro da faixa é um dia bem aproveitado.",
];

const GREEN_MESSAGES = [
  "Jornada excepcional! Você superou o máximo previsto. Dia acima do padrão!",
  "Resultado extraordinário! Sua produtividade fez toda a diferença hoje.",
  "Acima do máximo! Aproveitou muito bem os horários. Continue assim!",
  "Dia top! Você foi além do que o sistema previa. Repita essa fórmula.",
  "Excelente desempenho! Quem trabalha com estratégia colhe resultado assim.",
];

const ATYPICAL_MESSAGES = [
  "Dia atípico! Ganhou acima do máximo com baixa produtividade — provavelmente corridas longas ou tarifa dinâmica.",
  "Resultado fora do padrão. Poucas corridas, alto valor — corridas longas ou surge pricing no jogo.",
  "Dia atípico! Alto ganho com menos corridas indica corridas especiais ou tarifas elevadas.",
];

export function getMotivationalMessage(
  level: PerformanceLevel,
  seed: number
): string {
  if (level === "atypical") {
    return ATYPICAL_MESSAGES[seed % ATYPICAL_MESSAGES.length];
  }
  if (level === "red") return RED_MESSAGES[seed % RED_MESSAGES.length];
  if (level === "orange") return ORANGE_MESSAGES[seed % ORANGE_MESSAGES.length];
  return GREEN_MESSAGES[seed % GREEN_MESSAGES.length];
}

export function getPerformanceLevel(
  earnedPerHour: number,
  avgMinPerHour: number,
  avgMaxPerHour: number,
  totalEarned: number,
  totalMax: number,
  productivityIndex: number
): PerformanceLevel {
  if (totalEarned > totalMax && productivityIndex < 0.8) return "atypical";
  if (earnedPerHour >= avgMaxPerHour) return "green";
  if (earnedPerHour > avgMinPerHour) return "orange";
  return "red";
}
