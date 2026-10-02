import React from 'react';
import { Cpu, Database, Waves, BrainCircuit, Map, ShieldAlert, ArrowDown, CheckCircle2 } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const steps = [
    {
      title: '1. Multi-Modal Data Ingestion Layer',
      desc: 'USGS SRTM 30m DEM, Sentinel-1 SAR imagery, IMD Rain Grid, India-WRIS CWC Dam Storage APIs',
      icon: Database,
      color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
    },
    {
      title: '2. Spatial Data & Geo Processing Engine',
      desc: 'PostGIS spatial queries, Manning roughness (n) rasterization, hydro-channel extraction',
      icon: Cpu,
      color: 'border-blue-500/50 bg-blue-950/30 text-blue-300'
    },
    {
      title: '3. 2D Hydrodynamic Numerical Solver',
      desc: 'Smoothed Particle Hydrodynamics (SPH) & Delft3D-FM 2D Shallow Water Wave Equations',
      icon: Waves,
      color: 'border-indigo-500/50 bg-indigo-950/30 text-indigo-300'
    },
    {
      title: '4. AI Deep Neural Risk Engine',
      desc: 'Multi-factor Deep Neural Net predicting inundation hazard scores, critical infrastructure vulnerability',
      icon: BrainCircuit,
      color: 'border-purple-500/50 bg-purple-950/30 text-purple-300'
    },
    {
      title: '5. GIS Command Visualization Center',
      desc: 'React Leaflet interactive map, dynamic wave arrival timeline, What-If scenario matrix',
      icon: Map,
      color: 'border-sky-500/50 bg-sky-950/30 text-sky-300'
    },
    {
      title: '6. Tactical Evacuation & Response Hub',
      desc: 'A* shortest safe route planner, CAP SMS alert dispatcher, NDRF resource priority matrix',
      icon: ShieldAlert,
      color: 'border-red-500/50 bg-red-950/30 text-red-300'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            FloodTwin System Pipeline & Technical Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end closed-loop digital twin pipeline from physical data ingestion to tactical response
          </p>
        </div>
      </div>

      {/* Flow Diagram Box */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
          Closed-Loop Digital Twin Pipeline Workflow
        </h3>

        <div className="max-w-2xl mx-auto space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className={`p-4 rounded-xl border ${step.color} shadow-lg space-y-1 transition-all hover:scale-[1.01]`}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <h4 className="font-bold text-sm text-slate-100">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-8">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-5 h-5 text-slate-600 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
};
