import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { DamSystem, SimulationResult, VillageAtRisk, InfrastructureAsset } from '../types';
import { AlertCircle, ShieldAlert, Waves, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// Fix default Leaflet icon paths in Webpack/Vite
const damIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const villageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [35, 35]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [35, 35]
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [24, 38],
  iconAnchor: [12, 38],
  popupAnchor: [1, -32],
  shadowSize: [35, 35]
});

interface FloodMapProps {
  dam: DamSystem;
  simulationResult: SimulationResult;
  heightClass?: string;
  onSelectVillage?: (v: VillageAtRisk) => void;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  dam,
  simulationResult,
  heightClass = "h-[650px]",
  onSelectVillage
}) => {
  // Layer toggles state
  const [layers, setLayers] = useState({
    floodExtent: true,
    floodDepth: true,
    velocityVectors: true,
    arrivalContours: true,
    villages: true,
    infrastructure: true,
    riverNetwork: true
  });

  const center: [number, number] = [dam.lat - 0.15, dam.lng - 0.15]; // centered to view full reach to Rishikesh

  // Coordinates of Bhagirathi-Ganga river channel
  const riverPolyline: [number, number][] = [
    [dam.lat, dam.lng],
    [30.3892, 78.4721],
    [30.3341, 78.3984],
    [30.2200, 78.4200],
    [30.1460, 78.5986], // Devprayag
    [30.1362, 78.3892], // Shivpuri
    [30.1264, 78.3249], // Rishikesh Laxman Jhula
    [30.1142, 78.3090], // Muni Ki Reti
    [30.0768, 78.2878], // AIIMS
    [29.9567, 78.1709]  // Haridwar
  ];

  // Inundation polygon generation (scaled dynamically by simulation results)
  const spread = Math.min(0.08, 0.02 + (simulationResult.inundationAreaKm2 / 4000));
  const floodPolygonLeft: [number, number][] = riverPolyline.map(([lat, lng]) => [lat + spread * 0.4, lng - spread]);
  const floodPolygonRight: [number, number][] = [...riverPolyline].reverse().map(([lat, lng]) => [lat - spread * 0.4, lng + spread]);
  const floodExtentCoordinates: [number, number][] = [...floodPolygonLeft, ...floodPolygonRight];

  // Depth contour polygons
  const coreDepthPolygon: [number, number][] = riverPolyline.map(([lat, lng]) => [lat, lng - spread * 0.4]);
  const coreDepthRight: [number, number][] = [...riverPolyline].reverse().map(([lat, lng]) => [lat, lng + spread * 0.4]);
  const highDepthCoordinates: [number, number][] = [...coreDepthPolygon, ...coreDepthRight];

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
      
      {/* Map Control Bar Overlay */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">GIS Hydrodynamic Layer Controls</span>
          <span className="text-slate-500 font-mono text-[10px]">| Base: OpenStreetMap CartoDB Dark</span>
        </div>
        
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries({
            floodExtent: 'Flood Extent',
            floodDepth: 'Water Depth',
            velocityVectors: 'Flow Velocity',
            arrivalContours: 'Arrival Contours',
            villages: 'Villages',
            infrastructure: 'Infrastructure'
          }).map(([key, label]) => {
            const isEnabled = layers[key as keyof typeof layers];
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key as keyof typeof layers)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                  isEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                {isEnabled ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className={`w-full ${heightClass} relative`}>
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Dark Matter Carto Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* River Channel Polyline */}
          {layers.riverNetwork && (
            <Polyline
              positions={riverPolyline}
              pathOptions={{ color: '#0284c7', weight: 4, opacity: 0.8 }}
            >
              <Tooltip sticky>Main Bhagirathi-Ganga River Hydro Channel</Tooltip>
            </Polyline>
          )}

          {/* Outer Inundation Extent Polygon */}
          {layers.floodExtent && (
            <Polygon
              positions={floodExtentCoordinates}
              pathOptions={{
                color: '#38bdf8',
                fillColor: '#0284c7',
                fillOpacity: 0.35,
                weight: 2,
                dashArray: '4, 4'
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-100">
                  <p className="font-bold text-cyan-300 text-sm">Predicted Inundation Zone</p>
                  <p className="text-xs">Est Area: <span className="font-mono text-cyan-200 font-bold">{simulationResult.inundationAreaKm2} km²</span></p>
                  <p className="text-xs">Max Velocity: <span className="font-mono text-cyan-200">{simulationResult.maxVelocityMs} m/s</span></p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* High Depth Core Hydro Polygon */}
          {layers.floodDepth && (
            <Polygon
              positions={highDepthCoordinates}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#dc2626',
                fillOpacity: 0.55,
                weight: 1.5
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-100">
                  <p className="font-bold text-red-400 text-sm">High Hazard Hydro Core (&gt;3.5m Depth)</p>
                  <p className="text-xs text-slate-300">Max Depth: <span className="font-bold text-red-300">{simulationResult.maxDepthMeters} m</span></p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Dam Location Epicenter Marker */}
          <Marker position={[dam.lat, dam.lng]} icon={damIcon}>
            <Popup>
              <div className="p-1 space-y-1 text-slate-100">
                <div className="flex items-center space-x-1 text-red-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{dam.name}</span>
                </div>
                <p className="text-xs text-slate-300">{dam.river}</p>
                <div className="bg-slate-900 p-2 rounded border border-slate-700 text-xs font-mono space-y-0.5 mt-2">
                  <p>Storage: {dam.normalStorageVolume} MCM</p>
                  <p>Reservoir Stage: {dam.currentWaterLevel}m MSL</p>
                  <p className="text-red-400 font-bold">Breach Epicenter</p>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Villages at Risk Markers */}
          {layers.villages && simulationResult.villages.map((village) => (
            <Marker
              key={village.id}
              position={[village.lat, village.lng]}
              icon={villageIcon}
              eventHandlers={{
                click: () => onSelectVillage && onSelectVillage(village)
              }}
            >
              <Popup>
                <div className="p-1.5 space-y-1.5 text-slate-100 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-bold text-amber-300 text-sm">{village.name}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      village.riskLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-400' : 'bg-orange-500/30 text-orange-400'
                    }`}>
                      {village.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 font-mono text-slate-300">
                    <p>Flood Arrival: <span className="text-cyan-300 font-bold">{village.arrivalTimeMinutes} mins</span></p>
                    <p>Max Depth: <span className="text-red-400 font-bold">{village.maxDepthMeters} m</span></p>
                    <p>Flow Velocity: <span className="text-slate-200">{village.flowVelocity} m/s</span></p>
                    <p>Population: <span className="text-slate-200">{village.population.toLocaleString()}</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Infrastructure Assets Markers */}
          {layers.infrastructure && simulationResult.infrastructure.map((asset) => {
            const icon = asset.category === 'Hospital' ? hospitalIcon : asset.category === 'Shelter' ? shelterIcon : villageIcon;
            return (
              <Marker
                key={asset.id}
                position={[asset.lat, asset.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-slate-100">
                    <p className="font-bold text-cyan-300 text-sm">{asset.name}</p>
                    <p className="text-xs text-slate-400">Category: {asset.category}</p>
                    <div className="text-xs font-mono space-y-0.5 mt-1">
                      <p>Distance to River: {asset.distanceFromRiverBank}m</p>
                      <p>Status: <span className={`font-bold ${asset.status === 'SAFE' ? 'text-emerald-400' : 'text-red-400'}`}>{asset.status}</span></p>
                      {asset.contactPhone && <p className="text-slate-300">Contact: {asset.contactPhone}</p>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-lg shadow-xl text-xs z-[1000] max-w-[220px]">
          <h4 className="font-bold text-slate-200 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>GIS Map Legend</span>
            <span className="text-[10px] text-cyan-400 font-mono">DEMO</span>
          </h4>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-sm bg-red-600 opacity-80 border border-red-400"></span>
              <span className="text-slate-300">Hydro Core (&gt;3.5m Depth)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-sm bg-sky-500 opacity-50 border border-sky-400"></span>
              <span className="text-slate-300">Inundation Zone Extent</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Villages at Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Relief Shelters</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-slate-300">Hospitals & Civil Infra</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
