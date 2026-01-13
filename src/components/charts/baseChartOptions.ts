
import type { EChartsOption } from "echarts";
import { getThemeTokens } from "../../theme/useTheme";

export function baseChartOptions(): Partial<EChartsOption> {
  const t = getThemeTokens();
  return {
    backgroundColor: "transparent",
    textStyle: { color: t.text, fontFamily: "system-ui" },
    grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: t.card,
      borderColor: t.divider as any,
      borderWidth: 1,
      textStyle: { color: t.text },
    },
  };
}
