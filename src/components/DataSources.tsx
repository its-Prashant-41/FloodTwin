import React from 'react';
import { Database, Code, CheckCircle2, Server, Globe, ExternalLink } from 'lucide-react';

export const DataSources: React.FC = () => {
  const sources = [
    {
      name: 'India-WRIS Water Resources Info System',
      org: 'Central Water Commission (CWC), Ministry of Jal Shakti',
      type: 'REST / GeoServer WFS API',
      status: 'INTEGRATION READY',
      desc: 'Real-time reservoir live levels, storage capacities, spillway discharge tables, and gauge historical baselines.'
    },
    {
      name: 'USGS SRTM 30m Global DEM',
      org: 'US Geological Survey / NASA',
      type: 'GeoTIFF / Cloud-Optimized GeoTIFF (COG)',
      status: 'INGESTED',
      desc: 'High-resolution digital elevation model used for slope extraction, Manning roughness (n), and channel bathymetry.'
    },
    {
      name: 'ESA Sentinel-1 SAR Synthetic Aperture Radar',
      org: 'European Space Agency (Copernicus Program)',
      type: 'Sentinel Hub API / GRD Products',
      status: 'DEMO INTEGRATED',
      desc: 'All-weather C-Band radar imagery for instant surface water detection and post-breach change detection masking.'
    },
    {
      name: 'IMD Automatic Weather Station (AWS) Grid',
      org: 'India Meteorological Department',
      type: 'JSON Hydro Telemetry Feed',
      status: 'LIVE MOCK STREAM',
      desc: 'High-density precipitation rate (mm/hr) and cloudburst alert telemetry.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Integrable Geospatial Data Sources & Backend API Specs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardized OGC web services, GeoJSON formats, and FastAPI REST schema specifications
          </p>
        </div>
      </div>

      {/* Sources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{s.name}</h4>
                <p className="text-xs text-slate-400">{s.org}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {s.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">{s.desc}</p>
            
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              Format: <span className="text-cyan-300 font-bold">{s.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Code / API Schema Sample Box */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          FastAPI & PostGIS Endpoint Definition (`/api/v1/simulation/run`)
        </h3>

        <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`@app.post("/api/v1/simulation/hydrodynamic-run", response_model=SimulationOutputSchema)
async def run_hydrodynamic_solver(
    params: SimulationInputSchema,
    db: Session = Depends(get_db_session)
):
    """
    Executes SPH 2D Shallow Water Hydrodynamic Solver over PostGIS DEM mesh.
    Returns GeoJSON inundation extent polylines, max depth raster, and village arrival vectors.
    """
    mesh = await postgis_engine.fetch_dem_raster(params.dam_id)
    result = hydro_solver.compute_breach_wave(mesh, params)
    return JSONResponse(content=result.to_geojson())`}
        </pre>
      </div>

    </div>
  );
};
