import React from 'react';
import { ShieldAlert, Users, Anchor, Stethoscope, LifeBuoy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RESPONSE_PRIORITIES } from '../services/mockData';

export const ResponsePriority: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            NDRF / SDRF Disaster Response Priority Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tactical decision support ranking downstream sectors by evacuation urgency and resource allocation
          </p>
        </div>
      </div>

      {/* Priority Cards */}
      <div className="space-y-4">
        {RESPONSE_PRIORITIES.map((item) => (
          <div 
            key={item.priorityRank}
            className={`p-5 rounded-2xl border space-y-4 shadow-xl transition-all ${
              item.priorityRank === 1
                ? 'bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border-red-700/60'
                : item.priorityRank === 2
                ? 'bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border-orange-700/50'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  item.priorityRank === 1 ? 'bg-red-600 text-white' : item.priorityRank === 2 ? 'bg-orange-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  #{item.priorityRank}
                </span>
                <h3 className="font-bold text-slate-100 text-base">{item.sectorName}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  item.urgencyLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {item.urgencyLevel} URGENCY
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-950 px-3 py-1 rounded border border-slate-800">
                  Wave Arrival: T+{item.arrivalTime} min
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Population at Risk</span>
                <span className="text-emerald-400 font-extrabold text-sm">{item.populationAtRisk.toLocaleString()}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Expected Water Stage</span>
                <span className="text-red-400 font-extrabold text-sm">{item.expectedDepth} meters</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Assigned NDRF Battalions</span>
                <span className="text-cyan-300 font-extrabold text-sm">{item.assignedNDRFUnits} Units</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Amphibious Boats Needed</span>
                <span className="text-amber-400 font-extrabold text-sm">{item.rescueBoatsRequired} Boats</span>
              </div>
            </div>

            {/* Tactical Resource Allocation */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-800/80 gap-3">
              <div className="flex items-center space-x-4 text-slate-300">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Medical Teams: <strong className="text-slate-100">{item.medicalTeamsAssigned}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" /> Staging Shelter: <strong className="text-slate-100">{item.shelterDestination}</strong>
                </span>
              </div>

              <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs transition-all">
                Dispatch Battalion Resources
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
