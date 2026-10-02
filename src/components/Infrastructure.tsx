import React, { useState } from 'react';
import { Building2, Search, Filter, ShieldCheck, AlertCircle, Phone, MapPin } from 'lucide-react';
import { SimulationResult, InfrastructureAsset } from '../types';

interface InfrastructureProps {
  simulationResult: SimulationResult;
}

export const Infrastructure: React.FC<InfrastructureProps> = ({
  simulationResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAssets = simulationResult.infrastructure.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || asset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Critical Infrastructure Risk Inventory & Readiness Status
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time submersion vulnerability mapping for hospitals, emergency bridges, substations, and shelters
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search facility name, bridge, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-semibold">Category:</span>
          {['ALL', 'Hospital', 'Bridge', 'Road', 'Power Plant', 'Shelter'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 shadow-lg hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{asset.category}</span>
                <h4 className="font-bold text-slate-100 text-sm">{asset.name}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                asset.status === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                asset.status === 'AT_RISK' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400 animate-pulse'
              }`}>
                {asset.status}
              </span>
            </div>

            <div className="space-y-1 text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Dist to River Bank:</span>
                <span className="text-slate-200 font-bold">{asset.distanceFromRiverBank} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arrival Lead Time:</span>
                <span className="text-cyan-300 font-bold">{asset.estimatedArrivalMinutes} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exp Water Depth:</span>
                <span className="text-red-400 font-bold">{asset.expectedDepthMeters} m</span>
              </div>
              {asset.capacity && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Staging Capacity:</span>
                  <span className="text-emerald-400 font-bold">{asset.capacity.toLocaleString()} persons</span>
                </div>
              )}
            </div>

            {asset.contactPhone && (
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 pt-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact: {asset.contactPhone}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
