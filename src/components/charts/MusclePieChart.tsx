
import React from "react";
import ReactECharts from "echarts-for-react";
import { baseChartOptions } from "./baseChartOptions";
import { getThemeTokens } from "../../theme/useTheme";

export function MusclePieChart({ slices }: { slices: { name: string; value: number }[] }) {
  const t = getThemeTokens();
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const opt = {
    ...baseChartOptions(),
    tooltip: { trigger: "item", confine: true },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],     // donut
        avoidLabelOverlap: true,
        itemStyle: { borderColor: t.card, borderWidth: 2 },
        label: { color: t.text, formatter: "{b}" },
        labelLine: { lineStyle: { color: t.divider } },
        data: slices,
        animationDuration: shouldReduceMotion ? 0 : 550,
        animationEasing: "cubicOut",
      },
    ],
  };

  return <ReactECharts option={opt} style={{ height: 240 }} />;
}
