
import React from "react";
import ReactECharts from "echarts-for-react";
import { baseChartOptions } from "./baseChartOptions";
import { getThemeTokens } from "../../theme/useTheme";

export function WeeklyBarChart({ weeks }: { weeks: { label: string; value: number }[] }) {
  const t = getThemeTokens();
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const opt = {
    ...baseChartOptions(),
    xAxis: {
      type: "category",
      data: weeks.map(w => w.label),
      axisLabel: { color: t.muted },
      axisLine: { lineStyle: { color: t.divider } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: t.muted },
      splitLine: { lineStyle: { color: t.divider } },
    },
    series: [
      {
        type: "bar",
        data: weeks.map(w => w.value),
        barMaxWidth: 22,
        itemStyle: { color: t.accent, borderRadius: [6, 6, 0, 0] },
        animationDuration: shouldReduceMotion ? 0 : 450,
        animationEasing: "cubicOut",
      },
    ],
  };

  return <ReactECharts option={opt} style={{ height: 220 }} />;
}
