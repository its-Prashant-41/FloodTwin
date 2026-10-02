import React from 'react';
import { Clock, MapPin, AlertCircle, Waves, ArrowRight, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SimulationResult, DamSystem } from '../types';

interface ArrivalPredictionProps {
  dam: DamSystem;
  simulationResult: SimulationResult;
}

export const ArrivalPrediction: React.FC<ArrivalPredictionProps> = ({
  dam,
  simulationResult
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Downstream Flood Wave Arrival Lead Time Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Propagation delay based on channel geometry, Manning roughness, and wave celerity (C = √(g · d))
          </p>
        </div>
      </div>

      {/* Downstream Propagation Visual Node Timeline */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          Flood Front Propagation Sequence
        </h3>

        {/* Node Step Chain */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto pb-4">
          
          {/* Dam Epicenter Node */}
          <div className="bg-red-950/80 border border-red-600/50 p-4 rounded-xl text-center min-w-[160px] space-y-1">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">Dam Epicenter</span>
            <p className="font-bold text-slate-100 text-xs mt-1">{dam.name}</p>
            <p className="font-mono text-xs text-red-400 font-black">T+00 min</p>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block flex-shrink-0" />

          {/* Villages Propagation Steps */}
          {simulationResult.villages.map((v, i) => (
            <React.Fragment key={v.id}>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center min-w-[160px] space-y-1 hover:border-cyan-500/50 transition-all">
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  v.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  Reach {i + 1}
                </span>
                <p className="font-bold text-slate-200 text-xs truncate max-w-[150px]">{v.name}</p>
                <p className="font-mono text-sm text-cyan-300 font-extrabold">{v.arrivalTimeMinutes} mins</p>
                <p className="text-[10px] text-slate-400 font-mono">Depth: {v.maxDepthMeters}m</p>
              </div>

              {i < simulationResult.villages.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block flex-shrink-0" />
              )}
            </React.Fragment>
          ))}

        </div>
      </div>

      {/* Downstream Stage & Arrival Plot */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200">
          Arrival Lead Time vs Distance from Dam Breach
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationResult.villages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#38bdf8" fontSize={10} label={{ value: 'Arrival (mins)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Line type="monotone" dataKey="arrivalTimeMinutes" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6, fill: '#0284c7' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
