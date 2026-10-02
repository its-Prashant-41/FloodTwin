import React, { useState } from 'react';
import { Satellite, Eye, Sliders, Layers, Sparkles, AlertCircle } from 'lucide-react';

export const SatelliteMonitoring: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeLayer, setActiveLayer] = useState<'sar' | 'change' | 'optical'>('sar');

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            Sentinel-1 Synthetic Aperture Radar (SAR) Satellite Change Detection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ESA Sentinel-1 C-Band SAR Imagery (10m Resolution) for All-Weather Cloud-Penetrating Inundation Masking
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SAR BACKSCATTER COHERENCE: 0.92</span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Baseline Water Area</span>
          <p className="text-2xl font-black font-mono text-slate-200">18.4 km²</p>
          <p className="text-[10px] text-slate-400">Pre-Breach Sentinel-1 Pass</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Detected Post-Flood Area</span>
          <p className="text-2xl font-black font-mono text-cyan-300">184.2 km²</p>
          <p className="text-[10px] text-emerald-400 font-bold font-mono">+901% Surface Water Expansion</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Radar Backscatter Drop (σ⁰)</span>
          <p className="text-2xl font-black font-mono text-amber-400">-16.2 dB</p>
          <p className="text-[10px] text-amber-300/80">Specular Water Reflection</p>
        </div>
      </div>

      {/* Interactive Satellite Comparison Canvas */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
          <h3 className="font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Interactive Sentinel-1 Pre vs Post-Breach Slider
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Mode:</span>
            <button
              onClick={() => setActiveLayer('sar')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeLayer === 'sar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-950 text-slate-400'
              }`}
            >
              SAR Intensity (VV)
            </button>
            <button
              onClick={() => setActiveLayer('change')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeLayer === 'change' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-950 text-slate-400'
              }`}
            >
              Change Mask
            </button>
          </div>
        </div>

        {/* Visual Simulated Satellite Canvas Slider */}
        <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 select-none">
          
          {/* Pre-Event Image Canvas */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-slate-600 font-mono text-xs block uppercase tracking-widest">PRE-BREACH SENTINEL-1 PASS</span>
              <div className="w-64 h-32 border-2 border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs font-mono">
                Baseline River Channel (18.4 km²)
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Date: 2026-09-28 | Orbit #142</p>
            </div>
          </div>

          {/* Post-Event Image Canvas (Clipped by slider position) */}
          <div
            className="absolute inset-y-0 left-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950 via-slate-950 to-blue-950 border-r-2 border-cyan-400 shadow-2xl flex items-center justify-center overflow-hidden transition-all"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="text-center space-y-2 min-w-[500px]">
              <span className="text-cyan-400 font-mono text-xs block uppercase tracking-widest font-bold">POST-BREACH SAR INUNDATION MASK</span>
              <div className="w-80 h-40 border-2 border-cyan-500/50 bg-cyan-900/30 rounded-lg flex items-center justify-center text-cyan-200 text-xs font-mono font-bold shadow-inner">
                Detected Flood Water Specular Surface (184.2 km²)
              </div>
              <p className="text-[10px] text-cyan-300 font-mono">Date: 2026-10-02 | Orbit #143 (DEMO DATA)</p>
            </div>
          </div>

          {/* Slider Control Handle */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPos}
            onChange={(e) => setSliderPos(parseInt(e.target.value))}
            className="absolute inset-x-0 bottom-4 mx-auto w-3/4 accent-cyan-400 cursor-pointer z-20 opacity-80 hover:opacity-100"
          />

          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] text-slate-300 font-mono">
            Drag Slider to Compare Baseline vs Flood Mask
          </div>
        </div>

      </div>

    </div>
  );
};
