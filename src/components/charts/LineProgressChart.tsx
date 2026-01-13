
import React from "react";
import ReactECharts from "echarts-for-react";
import { baseChartOptions } from "./baseChartOptions";
import { getThemeTokens } from "../../theme/useTheme";

export function LineProgressChart({ points }: { points: { x: string; y: number }[] }) {
  const t = getThemeTokens();
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const opt = {
    ...baseChartOptions(),
    xAxis: {
      type: "category",
      data: points.map(p => p.x),
      axisLine: { lineStyle: { color: t.divider } },
      axisLabel: { color: t.muted },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: t.divider } },
      splitLine: { lineStyle: { color: t.divider } },
      axisLabel: { color: t.muted },
    },
    series: [
      {
        type: "line",
        data: points.map(p => p.y),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3, color: t.accent },
        areaStyle: { opacity: 0.08 },
        animationDuration: shouldReduceMotion ? 0 : 500,
        animationEasing: "cubicOut",
      },
    ],
  };

  return <ReactECharts option={opt} style={{ height: 220 }} />;
}
