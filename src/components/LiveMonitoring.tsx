import React, { useState, useEffect } from 'react';
import { Radio, Activity, RefreshCw, Zap, Gauge, CloudRain, Waves } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_TELEMETRY_STREAM } from '../services/mockData';
import { TelemetryReading } from '../types';

export const LiveMonitoring: React.FC = () => {
  const [stream, setStream] = useState<TelemetryReading[]>(MOCK_TELEMETRY_STREAM);
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
      const last = stream[stream.length - 1];
      
      const newReading: TelemetryReading = {
        timestamp: timeStr,
        reservoirLevel: parseFloat((last.reservoirLevel + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        spillwayDischarge: Math.round(last.spillwayDischarge + (Math.random() * 400 - 150)),
        downstreamStage: parseFloat((last.downstreamStage + (Math.random() * 0.3 - 0.1)).toFixed(1)),
        rainfallRate: Math.max(0, Math.round(last.rainfallRate + (Math.random() * 10 - 5))),
        acousticVelocity: parseFloat((last.acousticVelocity + (Math.random() * 0.4 - 0.2)).toFixed(1))
      };

      setStream(prev => [...prev.slice(1), newReading]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, stream]);

  const latest = stream[stream.length - 1];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            IoT Hydro-Meteorological Live Telemetry Stream
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sensor network telemetry from Tehri Hydro Complex & Central Water Commission River Gauges
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              isLive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{isLive ? 'STREAMING LIVE' : 'STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Reservoir Stage Gauge</span>
          <p className="text-2xl font-black font-mono text-cyan-300">{latest.reservoirLevel} <span className="text-xs font-normal">m MSL</span></p>
          <p className="text-[10px] text-emerald-400 font-mono">Tehri Crest Gauge #01</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Spillway Discharge</span>
          <p className="text-2xl font-black font-mono text-blue-400">{latest.spillwayDischarge.toLocaleString()} <span className="text-xs font-normal">m³/s</span></p>
          <p className="text-[10px] text-cyan-400 font-mono">Chute Spillway Gate Active</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Downstream Stage</span>
          <p className="text-2xl font-black font-mono text-amber-400">{latest.downstreamStage} <span className="text-xs font-normal">meters</span></p>
          <p className="text-[10px] text-slate-400 font-mono">Rishikesh CWC Gauge</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Catchment Rainfall</span>
          <p className="text-2xl font-black font-mono text-cyan-400">{latest.rainfallRate} <span className="text-xs font-normal">mm/hr</span></p>
          <p className="text-[10px] text-emerald-400 font-mono">IMD Automatic Weather Station</p>
        </div>
      </div>

      {/* Stream Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Spillway Discharge */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Spillway Discharge Hydrograph Stream</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stream}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#38bdf8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="spillwayDischarge" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Downstream Water Stage */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Downstream River Stage Height Stream</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stream}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#fbbf24" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="downstreamStage" stroke="#fbbf24" fill="#d97706" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
