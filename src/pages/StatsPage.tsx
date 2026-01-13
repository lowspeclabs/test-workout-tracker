import React, { useMemo, useState, useEffect } from "react";
import { MotionPage } from "../components/MotionPage";
import { StatCard } from "../components/StatCard";
import { LineProgressChart } from "../components/charts/LineProgressChart";
import { WeeklyBarChart } from "../components/charts/WeeklyBarChart";
import { MusclePieChart } from "../components/charts/MusclePieChart";
import { motion } from "framer-motion";
import { fetchStats } from '../api';

const ranges = ["1M", "3M", "6M", "YTD", "ALL"] as const;
type Range = typeof ranges[number];

export default function StatsPage() {
  const [range, setRange] = useState<Range>("3M");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  // in real app: select + aggregate based on range
  // For MVP: Mocking data change based on range to show animation
  const lineData = useMemo(() => demoLine(range), [range]);
  const barData  = useMemo(() => demoBars(range), [range]);
  const pieData  = useMemo(() => demoPie(range), [range]);

  return (
    <MotionPage>
      <div style={{ padding: 0 }}>
        <header className="mb-4">
          <h1 className="headline">Stats</h1>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>Your training history at a glance</div>
        </header>

        {/* Range chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
          {ranges.map(r => (
            <motion.button
              key={r}
              onClick={() => setRange(r)}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid var(--divider)",
                background: r === range ? "var(--text)" : "transparent",
                color: r === range ? "var(--bg)" : "var(--text)",
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {r}
            </motion.button>
          ))}
        </div>

        {/* High Level Metrics */}
         <div className="flex-row mb-4">
            <StatCard title="Total Sessions">
                <div style={{fontSize: '2rem', textAlign: 'center'}}>{stats?.total_sessions || 0}</div>
            </StatCard>
            <div style={{width: 16}}></div>
             <StatCard title="Total Volume">
                <div style={{fontSize: '2rem', textAlign: 'center'}}>--</div>
            </StatCard>
        </div>

        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <StatCard title="Strength progression">
            <LineProgressChart points={lineData} />
          </StatCard>

          <StatCard title="Weekly adherence">
            <WeeklyBarChart weeks={barData} />
          </StatCard>

          <StatCard title="Training focus">
            <MusclePieChart slices={pieData} />
          </StatCard>

          <StatCard title="Recent History">
             {stats?.recent_activity?.length > 0 ? (
                  stats.recent_activity.map((set: any) => (
                    <div key={set.id} style={{padding: '8px 0', borderBottom: '1px solid var(--divider)'}}>
                        {new Date(set.completed_at).toLocaleDateString()} - Set {set.set_index}: {set.weight}lbs x {set.reps}
                    </div>
                ))
             ) : (
                 <div style={{padding: '8px 0', color: 'var(--muted)'}}>No recent activity</div>
             )}
          </StatCard>
        </div>
      </div>
    </MotionPage>
  );
}

// Demo data generators
function demoLine(range: string) {
  const multiplier = range === '1M' ? 1 : range === '3M' ? 2 : 3;
  return Array.from({ length: 12 }).map((_, i) => ({ x: `W${i + 1}`, y: 80 + i * 2 * multiplier }));
}
function demoBars(range: string) {
  const offset = range === '1M' ? 0 : 2;
  return Array.from({ length: 12 }).map((_, i) => ({ label: `W${i + 1}`, value: ((i + offset) % 4) + 1 }));
}
function demoPie(range: string) {
  return [
    { name: "Push", value: range === '1M' ? 40 : 25 },
    { name: "Pull", value: 25 },
    { name: "Legs", value: range === '1M' ? 15 : 30 },
    { name: "Core", value: 20 },
  ];
}
