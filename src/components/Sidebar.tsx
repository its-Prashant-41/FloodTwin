import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Zap, 
  SlidersHorizontal, 
  BrainCircuit, 
  Clock, 
  Navigation, 
  Building2, 
  Radio, 
  Satellite, 
  Bell, 
  ShieldAlert, 
  FileText, 
  Cpu, 
  Database,
  Landmark
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'map'
  | 'simulator'
  | 'comparison'
  | 'airisk'
  | 'arrival'
  | 'evacuation'
  | 'infra'
  | 'monitoring'
  | 'satellite'
  | 'alerts'
  | 'priority'
  | 'reports'
  | 'architecture'
  | 'datasources';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unacknowledgedAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unacknowledgedAlertsCount
}) => {
  
  const navSections: {
    title: string;
    items: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[];
  }[] = [
    {
      title: 'EXECUTIVE COMMAND',
      items: [
        { id: 'dashboard', label: 'EOC Command Center', icon: LayoutDashboard },
        { id: 'map', label: 'GIS Hydro Map', icon: Map },
      ]
    },
    {
      title: 'HYDRODYNAMIC SIMULATION',
      items: [
        { id: 'simulator', label: 'Dam Break Simulator', icon: Zap },
        { id: 'comparison', label: 'What-If Matrix', icon: SlidersHorizontal },
      ]
    },
    {
      title: 'AI HAZARD INTELLIGENCE',
      items: [
        { id: 'airisk', label: 'AI Hazard Classifier', icon: BrainCircuit, badge: 'AI' },
        { id: 'arrival', label: 'Wave Arrival Lead Time', icon: Clock },
      ]
    },
    {
      title: 'TACTICAL RESPONSE & DISPATCH',
      items: [
        { id: 'evacuation', label: 'Evacuation Router', icon: Navigation },
        { id: 'infra', label: 'Critical Asset Risk', icon: Building2 },
        { id: 'alerts', label: 'Alert Dispatcher', icon: Bell, badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined },
        { id: 'priority', label: 'NDRF Response Matrix', icon: ShieldAlert },
      ]
    },
    {
      title: 'TELEMETRY & SATELLITE',
      items: [
        { id: 'monitoring', label: 'IoT Live Telemetry', icon: Radio },
        { id: 'satellite', label: 'Sentinel-1 SAR Radar', icon: Satellite },
      ]
    },
    {
      title: 'OFFICIAL SYSTEM SPECS',
      items: [
        { id: 'reports', label: 'Official DDMA Reports', icon: FileText },
        { id: 'architecture', label: 'System Pipeline', icon: Cpu },
        { id: 'datasources', label: 'Data Integration APIs', icon: Database },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none py-3">
      
      {/* Official Division Badge Header */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1">
          <Landmark className="w-3 h-3 text-amber-400" /> NDMA-EOC CELL
        </span>
        <span className="text-[9px] font-mono text-slate-500">v2.4 GOVT</span>
      </div>

      <nav className="flex-1 space-y-4 px-2 overflow-y-auto custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <h3 className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-900 text-amber-300 border border-amber-500/40 shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-mono ${
                      typeof item.badge === 'number'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="px-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
        <p className="font-semibold text-slate-400">SIH-1754 HydroTwin</p>
        <p>Govt of India EOC Portal</p>
      </div>

    </aside>
  );
};
