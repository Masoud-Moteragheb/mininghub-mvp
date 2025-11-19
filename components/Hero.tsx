'use client';

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-emerald-800">Welcome to MiningHub</h3>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-neutral-700">
            Showcase mining projects, exchange best practices on mine water & hydrogeology,
            and collaborate on research — all in one professional space.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">Browse Projects</button>
            <button className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Read Guidelines</button>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <MiniStat kpi="+64" label="New projects" />
            <MiniStat kpi="+310" label="New members" />
            <MiniStat kpi="98%" label="Uptime" />
          </div>
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
