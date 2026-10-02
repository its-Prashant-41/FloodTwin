import React from 'react';
import { ShieldCheck, AlertTriangle, Building2, Landmark } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 text-slate-200 select-none">
      {/* Top India Tricolor Accent Line */}
      <div className="govt-tricolor-bar" />
      
      <div className="px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 bg-slate-950/95 font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider">GOVERNMENT OF INDIA</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 text-[11px] font-sans font-medium">
            Ministry of Jal Shakti & National Disaster Management Authority (NDMA)
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-block text-cyan-400 text-[11px]">
            EOC Cell: Central Water Commission (CWC)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px]">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> SIH PROTOTYPE DEMO MODE
          </span>
          <span className="hidden md:inline text-slate-500">Ref: SIH-1754/NDMA-EOC</span>
        </div>
      </div>
    </div>
  );
};
