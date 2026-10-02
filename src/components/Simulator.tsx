import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  RotateCcw, 
  Waves, 
  Gauge, 
  Clock, 
  CloudRain, 
  Layers, 
  Sliders, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DamSystem, SimulationParams, SimulationResult, DamId } from '../types';
import { DAMS_REGISTRY } from '../services/hydroEngine';
import confetti from 'canvas-confetti';

interface SimulatorProps {
  currentParams: SimulationParams;
  onRunSimulation: (params: SimulationParams) => void;
  simulationResult: SimulationResult;
  selectedDamId: DamId;
  onSelectDam: (damId: DamId) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  currentParams,
  onRunSimulation,
  simulationResult,
  selectedDamId,
  onSelectDam
}) => {
  const [params, setParams] = useState<SimulationParams>(currentParams);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const activeDam: DamSystem = DAMS_REGISTRY[selectedDamId] || DAMS_REGISTRY['tehri'];

  const handleChange = (field: keyof SimulationParams, value: number | string) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDamSwitch = (damId: DamId) => {
    onSelectDam(damId);
    const d = DAMS_REGISTRY[damId];
    if (d) {
      setParams({
        damId,
        waterLevel: d.currentWaterLevel,
        reservoirStorage: d.normalStorageVolume,
        breachWidth: d.defaultBreachWidth,
        breachDepth: d.defaultBreachDepth,
        breachFormationTime: d.defaultFormationTime,
        releaseDischargeRate: 1500,
        rainfallIntensity: 35,
        simulationDuration: 12
      });
    }
  };

  const applyPreset = (presetType: 'piping' | 'overtopping' | 'total') => {
    if (presetType === 'piping') {
      setParams(prev => ({
        ...prev,
        breachWidth: 60,
        breachDepth: 25,
        breachFormationTime: 75,
        releaseDischargeRate: 2000,
        rainfallIntensity: 20
      }));
    } else if (presetType === 'overtopping') {
      setParams(prev => ({
        ...prev,
        breachWidth: 150,
        breachDepth: 50,
        breachFormationTime: 45,
        releaseDischargeRate: 4500,
        rainfallIntensity: 65
      }));
    } else {
      setParams(prev => ({
        ...prev,
        breachWidth: 300,
        breachDepth: 80,
        breachFormationTime: 25,
        releaseDischargeRate: 12000,
        rainfallIntensity: 110
      }));
    }
  };

  const handleRun = () => {
    setIsSimulating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          onRunSimulation(params);
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
          } catch (e) {
            // ignore
          }
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Hydrodynamic Dam-Break Scenario Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            2D Shallow Water Hydrodynamic Solver (Delft3D-FM / SPH Numerical Approximation)
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Breach Presets:</span>
          <button
            onClick={() => applyPreset('piping')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold"
          >
            Small Piping Failure
          </button>
          <button
            onClick={() => applyPreset('overtopping')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold"
          >
            Moderate Overtopping
          </button>
          <button
            onClick={() => applyPreset('total')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 text-xs font-semibold"
          >
            Catastrophic Breach
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Parameters Form (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Simulation Input Vector
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
              Selected: {activeDam.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Field 1: Dam Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Dam Complex</label>
              <select
                value={selectedDamId}
                onChange={(e) => handleDamSwitch(e.target.value as DamId)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                {Object.values(DAMS_REGISTRY).map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            {/* Field 2: Water Stage Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Reservoir Water Level (m MSL)</label>
                <span className="font-mono text-cyan-400 font-bold">{params.waterLevel} m</span>
              </div>
              <input
                type="range"
                min={activeDam.maxWaterLevel - activeDam.height + 20}
                max={activeDam.maxWaterLevel + 10}
                step={0.5}
                value={params.waterLevel}
                onChange={(e) => handleChange('waterLevel', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Field 3: Reservoir Storage Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Reservoir Storage (MCM)</label>
                <span className="font-mono text-cyan-400 font-bold">{params.reservoirStorage} MCM</span>
              </div>
              <input
                type="number"
                value={params.reservoirStorage}
                onChange={(e) => handleChange('reservoirStorage', parseFloat(e.target.value) || 1000)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Field 4: Breach Width */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Breach Geometry Width (m)</label>
                <span className="font-mono text-amber-400 font-bold">{params.breachWidth} m</span>
              </div>
              <input
                type="range"
                min={20}
                max={400}
                step={5}
                value={params.breachWidth}
                onChange={(e) => handleChange('breachWidth', parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Field 5: Breach Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Breach Vertical Depth (m)</label>
                <span className="font-mono text-amber-400 font-bold">{params.breachDepth} m</span>
              </div>
              <input
                type="range"
                min={10}
                max={Math.min(100, activeDam.height)}
                step={2}
                value={params.breachDepth}
                onChange={(e) => handleChange('breachDepth', parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Field 6: Breach Formation Time */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Formation Time (mins)</label>
                <span className="font-mono text-slate-300 font-bold">{params.breachFormationTime} mins</span>
              </div>
              <input
                type="number"
                min={10}
                max={180}
                value={params.breachFormationTime}
                onChange={(e) => handleChange('breachFormationTime', parseInt(e.target.value) || 30)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Field 7: Release Discharge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Initial Spillway Discharge (m³/s)</label>
              <input
                type="number"
                step={500}
                value={params.releaseDischargeRate}
                onChange={(e) => handleChange('releaseDischargeRate', parseFloat(e.target.value) || 1000)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Field 8: Rainfall Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Catchment Rainfall (mm/hr)</label>
                <span className="font-mono text-cyan-300 font-bold">{params.rainfallIntensity} mm/h</span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={5}
                value={params.rainfallIntensity}
                onChange={(e) => handleChange('rainfallIntensity', parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setParams({
                  damId: selectedDamId,
                  waterLevel: activeDam.currentWaterLevel,
                  reservoirStorage: activeDam.normalStorageVolume,
                  breachWidth: activeDam.defaultBreachWidth,
                  breachDepth: activeDam.defaultBreachDepth,
                  breachFormationTime: activeDam.defaultFormationTime,
                  releaseDischargeRate: 1500,
                  rainfallIntensity: 35,
                  simulationDuration: 12
                });
              }}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Solving Hydrodynamic Mesh... ({progress}%)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>RUN HYDRODYNAMIC SIMULATION</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Simulation Output Analytics */}
        <div className="space-y-6">
          
          {/* Hydrograph Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Breach Outflow Hydrograph (Q vs Time)
            </h3>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationResult.hydrograph}>
                  <defs>
                    <linearGradient id="qGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} unit="h" />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: number) => [`${val.toLocaleString()} m³/s`, 'Peak Flow Q']}
                  />
                  <Area type="monotone" dataKey="discharge" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#qGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Summary Metrics */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Predicted Impact Summary</span>
              <span className="text-[10px] text-cyan-400 font-mono">SIMULATION SOLVED</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Peak Discharge</span>
                <p className="text-lg font-black text-cyan-300 font-mono">
                  {simulationResult.peakDischargeM3s.toLocaleString()} <span className="text-xs">m³/s</span>
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Inundation Area</span>
                <p className="text-lg font-black text-sky-400 font-mono">
                  {simulationResult.inundationAreaKm2} <span className="text-xs">km²</span>
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Max Water Depth</span>
                <p className="text-lg font-black text-red-400 font-mono">
                  {simulationResult.maxDepthMeters} <span className="text-xs">meters</span>
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Peak Flow Velocity</span>
                <p className="text-lg font-black text-amber-400 font-mono">
                  {simulationResult.maxVelocityMs} <span className="text-xs">m/s</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Villages Compromised:</span>
                <span className="text-amber-400 font-mono">{simulationResult.villagesAffectedCount} villages</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Population at Risk:</span>
                <span className="text-emerald-400 font-mono">{simulationResult.affectedPopulation.toLocaleString()} citizens</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
