import React from 'react';
import { SlidersHorizontal, BarChart, FileSpreadsheet, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { PRESET_SCENARIOS } from '../services/mockData';

export const ScenarioComparison: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            What-If Multi-Scenario Hydrodynamic Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparative analysis across Small Piping, Overtopping, and Catastrophic Dam Failure Scenarios
          </p>
        </div>
      </div>

      {/* Comparison Visual Charts (2 Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Flooded Area & Population */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Inundation Extent & Affected Population</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={PRESET_SCENARIOS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.split(':')[0]} />
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#34d399" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="inundationAreaKm2" name="Inundation Area (km²)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="populationAffected" name="Population Affected" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Arrival Time vs Max Depth */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Flood Wave Velocity & Arrival Lead Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={PRESET_SCENARIOS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.split(':')[0]} />
                <YAxis yAxisId="left" stroke="#f87171" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="maxDepthMeters" name="Max Water Depth (m)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="arrivalMinutesRishikesh" name="Arrival Time Rishikesh (min)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Structured Multi-Scenario Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          Detailed What-If Metric Comparison Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Scenario Parameter</th>
                {PRESET_SCENARIOS.map(sc => (
                  <th key={sc.id} className="p-3 text-cyan-300 font-bold">{sc.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-slate-200">Breach Failure Mode</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3">{sc.breachType}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Breach Geometry (Width x Depth)</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3">{sc.breachWidth}m × {sc.breachDepth}m</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Inundation Extent (km²)</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-sky-400">{sc.inundationAreaKm2} km²</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Max Water Depth (m)</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-red-400">{sc.maxDepthMeters} m</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Arrival Time at Rishikesh</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-amber-400">{sc.arrivalMinutesRishikesh} mins</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Population at Risk</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-emerald-400">{sc.populationAffected.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Infrastructure Affected</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-purple-300">{sc.infrastructureCount} facilities</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Est. Economic Impact</td>
                {PRESET_SCENARIOS.map(sc => (
                  <td key={sc.id} className="p-3 font-bold text-slate-100">₹ {sc.economicImpactCr.toLocaleString()} Cr</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
