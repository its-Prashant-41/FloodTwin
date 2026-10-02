import React from 'react';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, X, Waves, AlertTriangle, Landmark, FileCheck } from 'lucide-react';
import { DamSystem, SimulationParams, SimulationResult } from '../types';
import confetti from 'canvas-confetti';

interface ReportGeneratorProps {
  dam: DamSystem;
  simulationParams: SimulationParams;
  simulationResult: SimulationResult;
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  dam,
  simulationParams,
  simulationResult,
  onClose
}) => {

  const handlePrint = () => {
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch (e) {
      // ignore
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        
        {/* Modal Top Toolbar */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100 font-mono uppercase tracking-wider">
              GOVERNMENT OF INDIA — OFFICIAL DDMA DISASTER ASSESSMENT REPORT
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-900/20"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>PRINT / SAVE OFFICIAL PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Letterhead Document */}
        <div className="p-8 space-y-6 print:p-0 print:text-black font-sans bg-slate-900">
          
          {/* Government Top Header */}
          <div className="border-b-2 border-amber-500/40 pb-5 text-center space-y-1">
            <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold font-mono text-xs tracking-widest uppercase">
              <Landmark className="w-4 h-4" /> GOVERNMENT OF INDIA
            </div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight">
              NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Ministry of Jal Shakti & Central Water Commission (CWC) Hydrodynamic EOC
            </p>
            <p className="text-[10px] text-amber-400 font-mono font-bold pt-1">
              REF NO: NDMA/EOC/2026/HYDRO-TWIN/RPT-9812 | CLASSIFICATION: OFFICIAL DEMO
            </p>
          </div>

          {/* Document Title & Reference Metadata */}
          <div className="flex justify-between items-start bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px]">DAM DIGITAL TWIN SYSTEM</span>
              <p className="text-cyan-300 font-bold text-sm">{dam.name}</p>
              <p className="text-slate-300">{dam.river} | State: {dam.state}</p>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-slate-400">Date: <span className="text-slate-200">{new Date().toLocaleDateString('en-IN')}</span></p>
              <p className="text-slate-400">Issued By: <span className="text-slate-200">NDMA EOC Hydro Cell</span></p>
              <span className="inline-block px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold text-[10px] mt-1">
                STATUS: {simulationResult.overallRisk} HAZARD
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 text-xs uppercase font-mono tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-400" />
              1. Executive Hydrodynamic Risk Assessment Summary
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px]">Peak Outflow</span>
                <p className="font-extrabold text-cyan-300 text-sm">{simulationResult.peakDischargeM3s.toLocaleString()} m³/s</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Inundation Area</span>
                <p className="font-extrabold text-sky-400 text-sm">{simulationResult.inundationAreaKm2} km²</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Population Affected</span>
                <p className="font-extrabold text-emerald-400 text-sm">{simulationResult.affectedPopulation.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Max Water Depth</span>
                <p className="font-extrabold text-red-400 text-sm">{simulationResult.maxDepthMeters} meters</p>
              </div>
            </div>
          </div>

          {/* Section 2: Breach Parameters */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 text-xs uppercase font-mono tracking-wider border-b border-slate-800 pb-1">
              2. Dam Breach Solver Inputs & Hydraulics
            </h4>
            <div className="grid grid-cols-3 gap-3 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p>Reservoir Stage: <span className="text-cyan-300">{simulationParams.waterLevel}m MSL</span></p>
              <p>Storage Volume: <span className="text-cyan-300">{simulationParams.reservoirStorage} MCM</span></p>
              <p>Breach Width: <span className="text-amber-400">{simulationParams.breachWidth} meters</span></p>
              <p>Breach Depth: <span className="text-amber-400">{simulationParams.breachDepth} meters</span></p>
              <p>Formation Time: <span className="text-slate-200">{simulationParams.breachFormationTime} mins</span></p>
              <p>Catchment Rain: <span className="text-cyan-300">{simulationParams.rainfallIntensity} mm/hr</span></p>
            </div>
          </div>

          {/* Section 3: Affected Reaches Table */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 text-xs uppercase font-mono tracking-wider border-b border-slate-800 pb-1">
              3. Downstream Reach Submersion & Lead Times
            </h4>
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2">Downstream Reach / Town</th>
                  <th className="p-2">Distance</th>
                  <th className="p-2">Arrival Lead Time</th>
                  <th className="p-2">Max Depth</th>
                  <th className="p-2">Population</th>
                  <th className="p-2">Hazard Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {simulationResult.villages.map(v => (
                  <tr key={v.id}>
                    <td className="p-2 font-bold text-slate-200">{v.name}</td>
                    <td className="p-2">{v.distanceFromDam} km</td>
                    <td className="p-2 text-cyan-300 font-bold">{v.arrivalTimeMinutes} mins</td>
                    <td className="p-2 text-red-400 font-bold">{v.maxDepthMeters} m</td>
                    <td className="p-2 text-emerald-400">{v.population.toLocaleString()}</td>
                    <td className="p-2 font-bold">{v.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Signature Approval Blocks */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs font-mono">
            <div className="space-y-8">
              <p className="text-slate-400">Prepared & Verified By:</p>
              <div className="border-b border-slate-700 pb-1">
                <p className="font-bold text-slate-200">Er. R. K. Sharma</p>
                <p className="text-[10px] text-slate-400">Chief Hydro Engineer, Central Water Commission</p>
              </div>
            </div>

            <div className="space-y-8 text-right">
              <p className="text-slate-400">Approved & Issued By:</p>
              <div className="border-b border-slate-700 pb-1">
                <p className="font-bold text-amber-300">Dr. V. K. Paul, IAS</p>
                <p className="text-[10px] text-slate-400">Member Secretary, NDMA EOC Control Board</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
