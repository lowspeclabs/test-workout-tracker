
import type { EChartsOption } from "echarts";
import { getThemeTokens } from "../../theme/useTheme";

/**
 * Provides the base configuration for all ECharts instances in the application.
 * Ensures visual consistency by applying the global theme tokens (CSS variables) to chart elements.
 *
 * Configures:
 * - Background color (transparent to blend with cards)
 * - Typography (system fonts, theme text colors)
 * - Grid layout (consistent padding)
 * - Tooltips (styled to look like app UI components)
 *
 * @returns A partial ECharts configuration object.
 */
export function baseChartOptions(): Partial<EChartsOption> {
  const t = getThemeTokens();
  return {
    backgroundColor: "transparent",
    textStyle: { color: t.text, fontFamily: "system-ui" },
    grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
    tooltip: {
      trigger: "axis",
      confine: true, // Keeps tooltip within chart area
      backgroundColor: t.card,
      borderColor: t.divider as any,
      borderWidth: 1,
      textStyle: { color: t.text },
    },
  };
}
