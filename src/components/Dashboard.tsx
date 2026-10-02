import React from 'react';
import { 
  Users, 
  MapPin, 
  Building2, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  AlertTriangle, 
  Activity, 
  Waves, 
  Radio, 
  Landmark,
  ShieldCheck,
  Building
} from 'lucide-react';
import { DamSystem, SimulationResult, AlertItem, DamId } from '../types';
import { FloodMap } from './FloodMap';
import { NavTab } from './Sidebar';

interface DashboardProps {
  dam: DamSystem;
  simulationResult: SimulationResult;
  alerts: AlertItem[];
  onTabChange: (tab: NavTab) => void;
  onSelectDam: (damId: DamId) => void;
  onOpenReport: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  dam,
  simulationResult,
  alerts,
  onTabChange,
  onOpenReport
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Government EOC Command Directive Banner */}
      <div className="eoc-card-gold p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-amber-400" /> UT-SDMA & EOC CONTROL CELL
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {dam.name} — Hydrodynamic Emergency Operations Command
          </h2>
          <p className="text-xs text-slate-300">
            Basin Reach: <span className="text-cyan-300 font-semibold">{dam.river}</span> | State: {dam.state} | Dam Height: {dam.height}m | Reservoir Stage: <span className="font-mono text-amber-300">{dam.currentWaterLevel}m MSL</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onTabChange('simulator')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-900/30 active:scale-95"
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>RUN DAM BREAK SIMULATION</span>
          </button>
          
          <button
            onClick={() => onTabChange('evacuation')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 transition-all"
          >
            <span>TACTICAL EVACUATION ROUTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Active Scenarios */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">Active Scenarios</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">3</p>
          <p className="text-[10px] text-cyan-400 font-mono font-bold">1 Hydro Mesh Solved</p>
        </div>

        {/* Card 2: Monitored Dams */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">Dams Monitored</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">3</p>
          <p className="text-[10px] text-slate-400 font-mono">Tehri, Hirakud, Sardar S.</p>
        </div>

        {/* Card 3: Villages at Risk */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">Villages at Risk</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            {simulationResult.villagesAffectedCount}
          </p>
          <p className="text-[10px] text-amber-300 font-semibold font-mono">
            {simulationResult.villages.filter(v => v.riskLevel === 'CRITICAL').length} High Hazard Zones
          </p>
        </div>

        {/* Card 4: Critical Infrastructure */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">Infra Compromised</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-300 font-mono">
            {simulationResult.criticalInfraAffectedCount}
          </p>
          <p className="text-[10px] text-purple-400 font-mono">Hospitals, Bridges, Grid</p>
        </div>

        {/* Card 5: Affected Population */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">Pop. at Hazard</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {simulationResult.affectedPopulation.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-300 font-mono">Inundated Plain</p>
        </div>

        {/* Card 6: NDMA Risk Rating */}
        <div className="eoc-card p-3.5 rounded-xl space-y-1 border-amber-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">NDMA Risk Level</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className={`text-xl font-black font-mono ${
            simulationResult.overallRisk === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-orange-400'
          }`}>
            {simulationResult.overallRisk}
          </p>
          <p className="text-[10px] text-amber-400 font-mono">Official Rating</p>
        </div>

      </div>

      {/* Main Grid: GIS Command Map + Live Alert Ticker Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Central Flood Map (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              GIS Tactical Inundation Map Layer
            </h3>
            <button
              onClick={() => onTabChange('map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold font-mono flex items-center gap-1"
            >
              FULL GIS MAP <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <FloodMap dam={dam} simulationResult={simulationResult} heightClass="h-[520px]" />
        </div>

        {/* Right Sidebar: Active Alert Log & Priority Evacuation Reach */}
        <div className="space-y-6">
          
          {/* Active Alerts Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-xs text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Live CAP Dispatch Alerts
              </h4>
              <button
                onClick={() => onTabChange('alerts')}
                className="text-[11px] text-amber-400 font-mono font-bold hover:underline"
              >
                VIEW ALL ({alerts.length})
              </button>
            </div>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
              {alerts.slice(0, 3).map((alt) => (
                <div key={alt.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                      alt.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-orange-950 text-orange-300 border border-orange-800'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alt.time}</span>
                  </div>
                  <p className="font-bold text-slate-200">{alt.title}</p>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{alt.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Reach Node Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-xs text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                Priority Evacuation Reaches
              </h4>
              <button
                onClick={() => onTabChange('arrival')}
                className="text-[11px] text-cyan-400 font-mono font-bold hover:underline"
              >
                TIMELINE
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {simulationResult.villages.slice(0, 4).map(v => (
                <div key={v.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                  <div>
                    <p className="font-bold text-slate-200">{v.name}</p>
                    <p className="text-[10px] text-slate-400">Reach Dist: {v.distanceFromDam} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-300 font-bold">{v.arrivalTimeMinutes}m arrival</p>
                    <p className="text-[10px] text-red-400">{v.maxDepthMeters}m depth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
