import React from 'react';
import { BrainCircuit, ShieldAlert, Cpu, Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SimulationResult, DamSystem } from '../types';
import { INITIAL_AI_DIRECTIVES } from '../services/mockData';

interface AiRiskAssessmentProps {
  dam: DamSystem;
  simulationResult: SimulationResult;
}

export const AiRiskAssessment: React.FC<AiRiskAssessmentProps> = ({
  dam,
  simulationResult
}) => {
  const riskScore = Math.min(99, Math.max(45, Math.round((simulationResult.peakDischargeM3s / 300) + (simulationResult.maxDepthMeters * 5))));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              AI Hazard & Risk Assessment Engine
            </h2>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">
              SIMULATED AI INFERENCE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-factor Deep Neural Net analyzing DEM Slope, Hydrodynamics, Roughness (n), and Population Density
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Composite Hazard Index</span>
            <span className="text-2xl font-black font-mono text-red-400">{riskScore} / 100</span>
          </div>
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Input Features Matrix + Global Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ingested Features */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>AI Model Input Vector</span>
            <span className="text-[10px] text-emerald-400 font-mono">NORMALIZED</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">DEM Resolution:</span>
              <span className="font-mono text-cyan-300 font-bold">USGS 30m SRTM</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Manning Roughness (n):</span>
              <span className="font-mono text-slate-200">0.035 (Gravel Bed)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Peak Hydro Discharge:</span>
              <span className="font-mono text-cyan-300 font-bold">{simulationResult.peakDischargeM3s.toLocaleString()} m³/s</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Peak Water Depth:</span>
              <span className="font-mono text-red-400 font-bold">{simulationResult.maxDepthMeters} m</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">River Slope (S₀):</span>
              <span className="font-mono text-slate-200">0.0042 m/m</span>
            </div>
          </div>
        </div>

        {/* AI Action Directives (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Generated AI Response Directives</span>
            <span className="text-[10px] text-amber-400 font-mono">PRIORITY RANKED</span>
          </h3>

          <div className="space-y-3">
            {INITIAL_AI_DIRECTIVES.map((dir) => (
              <div key={dir.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{dir.sector}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-cyan-300">Score: {dir.riskScore}/100</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dir.hazardCategory === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {dir.hazardCategory}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300"><strong className="text-slate-400">Impact Analysis:</strong> {dir.keyImpact}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <p className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Action: {dir.actionRequired}
                  </p>
                  <span className="text-amber-400 font-mono font-bold">{dir.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
