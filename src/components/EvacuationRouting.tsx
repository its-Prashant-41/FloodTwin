import React, { useState } from 'react';
import { Navigation, MapPin, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Clock, Car } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { SimulationResult, VillageAtRisk, EvacuationRoute } from '../types';
import { EVACUATION_ROUTES } from '../services/mockData';

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36]
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [24, 38],
  iconAnchor: [12, 38]
});

interface EvacuationRoutingProps {
  simulationResult: SimulationResult;
}

export const EvacuationRouting: React.FC<EvacuationRoutingProps> = ({
  simulationResult
}) => {
  const [selectedVillageId, setSelectedVillageId] = useState<string>('v-5'); // Rishikesh default

  const route = EVACUATION_ROUTES.find(r => r.villageId === selectedVillageId) || EVACUATION_ROUTES[0];
  const targetVillage = simulationResult.villages.find(v => v.id === selectedVillageId) || simulationResult.villages[4];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            Dynamic Evacuation Path Router & Shelter Assignment
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time safest path algorithm avoiding inundated highway segments and low-lying river dips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Controls & Route Metrics */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5 shadow-xl">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Select Evacuation Origin Sector</label>
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              {simulationResult.villages.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.population.toLocaleString()} pop)</option>
              ))}
            </select>
          </div>

          {/* Route Summary Card */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Recommended Route Plan</span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                route.status === 'RECOMMENDED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {route.status}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Shelter:</span>
                <span className="text-emerald-400 font-bold">{route.shelterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route Distance:</span>
                <span className="text-cyan-300 font-bold">{route.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Transit Time:</span>
                <span className="text-slate-100 font-bold">{route.estTravelTimeMins} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flood Wave Arrival:</span>
                <span className="text-amber-400 font-bold">{targetVillage.arrivalTimeMinutes} mins</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Safety Time Margin:</span>
                <span className={`font-bold ${route.timeMarginMins > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {route.timeMarginMins > 0 ? `+${route.timeMarginMins} mins` : `${route.timeMarginMins} mins (URGENT AIRLIFT)`}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs space-y-1 text-cyan-200">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Safe Evacuation Directive
            </p>
            <p className="text-[11px] text-cyan-300/80">
              NH-58 bypass path active. State SDRF buses staged at Muni Ki Reti grounds.
            </p>
          </div>

        </div>

        {/* Right GIS Route Map (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl h-[480px]">
          <MapContainer
            center={route.waypoints[0] || [30.1264, 78.3249]}
            zoom={12}
            style={{ width: '100%', height: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Evacuation Route Polyline */}
            <Polyline
              positions={route.waypoints}
              pathOptions={{
                color: route.status === 'RECOMMENDED' ? '#10b981' : '#ef4444',
                weight: 5,
                opacity: 0.9,
                dashArray: '6, 6'
              }}
            />

            {/* Start Node */}
            <Marker position={route.waypoints[0]} icon={startIcon}>
              <Popup>
                <div className="p-1 font-bold text-xs text-slate-100">Origin: {targetVillage.name}</div>
              </Popup>
            </Marker>

            {/* End Shelter Node */}
            <Marker position={route.waypoints[route.waypoints.length - 1]} icon={shelterIcon}>
              <Popup>
                <div className="p-1 text-xs text-slate-100">
                  <p className="font-bold text-emerald-400">Shelter: {route.shelterName}</p>
                </div>
              </Popup>
            </Marker>

          </MapContainer>
        </div>

      </div>

    </div>
  );
};
