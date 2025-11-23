// components/Hero.tsx
"use client";

import { motion } from "framer-motion";

type HeroStats = {
  projects: number;
  discussions: number;
  events: number;
};

type HeroProps = {
  stats: HeroStats;
};

export default function Hero({ stats }: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-emerald-800">
            Welcome to MiningHub
          </h3>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-neutral-700">
            Showcase mining projects, share real-world experiences on mine water
            and hydrogeology, and collaborate with engineers, researchers, and
            companies in one professional space.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <MiniStat kpi={String(stats.projects)} label="Projects" />
          <MiniStat kpi={String(stats.discussions)} label="Discussions" />
          <MiniStat kpi={String(stats.events)} label="Events" />
        </div>
      </div>
    </motion.section>
  );
}

function MiniStat({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div className="rounded-xl border bg-neutral-50 p-3">
      <div className="text-lg font-semibold">{kpi}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}
