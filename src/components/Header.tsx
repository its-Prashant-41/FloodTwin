import React, { useState, useEffect } from 'react';
import { Activity, Waves, Download, ShieldAlert, Database, RefreshCw, Clock, Landmark, Radio } from 'lucide-react';
import { DamId, DamSystem, SimulationResult } from '../types';
import { DAMS_REGISTRY } from '../services/hydroEngine';

interface HeaderProps {
  selectedDamId: DamId;
  onSelectDam: (damId: DamId) => void;
  simulationResult: SimulationResult;
  onOpenReport: () => void;
  onResetSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDamId,
  onSelectDam,
  simulationResult,
  onOpenReport,
  onResetSimulation
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-300 border-red-600/70 shadow-lg shadow-red-900/30 animate-pulse';
      case 'HIGH': return 'bg-orange-950/80 text-orange-300 border-orange-600/70';
      case 'MODERATE': return 'bg-amber-950/80 text-amber-300 border-amber-600/70';
      default: return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70';
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-3 sticky top-0 z-30 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Official EOC Crest */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center border border-amber-500/40 shadow-lg shadow-blue-950/50">
            <Landmark className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>FloodTwin</span>
                <span className="text-slate-400 font-normal text-xs">| National Hydro EOC</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 tracking-widest font-mono">
                NDMA-EOC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-Time Hydrodynamic Inundation Decision Support Twin
            </p>
          </div>
        </div>

        {/* Center: Active Dam System Selector */}
        <div className="flex items-center space-x-3 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <Database className="w-4 h-4 text-cyan-400" />
          <div className="text-xs">
            <label htmlFor="dam-select-header" className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block font-mono">
              Monitored River System
            </label>
            <select
              id="dam-select-header"
              value={selectedDamId}
              onChange={(e) => onSelectDam(e.target.value as DamId)}
              className="bg-transparent text-cyan-200 font-bold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(DAMS_REGISTRY).map(dam => (
                <option key={dam.id} value={dam.id} className="bg-slate-900 text-slate-100">
                  {dam.name} ({dam.river.split('/')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Status Controls & Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime}</span>
          </div>

          {/* NDMA Emergency Level */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono border ${getRiskBadgeColor(simulationResult.overallRisk)}`}>
            <ShieldAlert className="w-4 h-4" />
            <span>NDMA LEVEL: {simulationResult.overallRisk}</span>
          </div>

          {/* Telemetry Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>CWC STREAM LIVE</span>
          </div>

          {/* Reset Parameters */}
          <button
            onClick={onResetSimulation}
            title="Reset Hydrodynamic Parameters"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Official Report Export */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-900/20 active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Official DDMA Report</span>
          </button>

        </div>

      </div>
    </header>
  );
};
