import React, { useState, useMemo } from 'react';
import { DamId, SimulationParams, SimulationResult, AlertItem, DamSystem } from './types';
import { DAMS_REGISTRY, runHydrodynamicSimulation } from './services/hydroEngine';
import { INITIAL_ALERTS } from './services/mockData';

// Components
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FloodMap } from './components/FloodMap';
import { Simulator } from './components/Simulator';
import { ScenarioComparison } from './components/ScenarioComparison';
import { AiRiskAssessment } from './components/AiRiskAssessment';
import { ArrivalPrediction } from './components/ArrivalPrediction';
import { EvacuationRouting } from './components/EvacuationRouting';
import { Infrastructure } from './components/Infrastructure';
import { LiveMonitoring } from './components/LiveMonitoring';
import { SatelliteMonitoring } from './components/SatelliteMonitoring';
import { AlertSystem } from './components/AlertSystem';
import { ResponsePriority } from './components/ResponsePriority';
import { ReportGenerator } from './components/ReportGenerator';
import { SystemArchitecture } from './components/SystemArchitecture';
import { DataSources } from './components/DataSources';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedDamId, setSelectedDamId] = useState<DamId>('tehri');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const activeDam: DamSystem = DAMS_REGISTRY[selectedDamId] || DAMS_REGISTRY['tehri'];

  // Initial Simulation Parameters
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
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

  // Calculate live simulation results reactively
  const simulationResult: SimulationResult = useMemo(() => {
    return runHydrodynamicSimulation(simulationParams);
  }, [simulationParams]);

  const handleSelectDam = (damId: DamId) => {
    setSelectedDamId(damId);
    const d = DAMS_REGISTRY[damId];
    if (d) {
      setSimulationParams({
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

  const handleRunSimulation = (newParams: SimulationParams) => {
    setSimulationParams(newParams);
  };

  const handleResetSimulation = () => {
    const d = DAMS_REGISTRY[selectedDamId];
    setSimulationParams({
      damId: selectedDamId,
      waterLevel: d.currentWaterLevel,
      reservoirStorage: d.normalStorageVolume,
      breachWidth: d.defaultBreachWidth,
      breachDepth: d.defaultBreachDepth,
      breachFormationTime: d.defaultFormationTime,
      releaseDischargeRate: 1500,
      rainfallIntensity: 35,
      simulationDuration: 12
    });
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const handleTriggerAlertBroadcast = (title: string, location: string) => {
    const newAlt: AlertItem = {
      id: `alt-${Date.now()}`,
      severity: 'CRITICAL',
      title: `Emergency Broadcast: ${title}`,
      location,
      time: 'Just now',
      message: 'Direct emergency warning broadcast dispatched to field personnel and public CAP sirens.',
      recommendedAction: 'Immediate high-ground evacuation.',
      acknowledged: false
    };
    setAlerts(prev => [newAlt, ...prev]);
  };

  const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Fixed Demo Banner */}
      <DemoBanner />

      {/* Main Command Header */}
      <Header
        selectedDamId={selectedDamId}
        onSelectDam={handleSelectDam}
        simulationResult={simulationResult}
        onOpenReport={() => setIsReportOpen(true)}
        onResetSimulation={handleResetSimulation}
      />

      {/* Main Body Layout: Sidebar + View Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unacknowledgedAlertsCount={unacknowledgedAlertsCount}
        />

        {/* Dynamic Main View Canvas */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950/60">
          {activeTab === 'dashboard' && (
            <Dashboard
              dam={activeDam}
              simulationResult={simulationResult}
              alerts={alerts}
              onTabChange={setActiveTab}
              onSelectDam={handleSelectDam}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-100">Full Interactive GIS Dam-Break Inundation Map</h2>
                <span className="text-xs font-mono text-cyan-400">Tehri - Bhagirathi River System</span>
              </div>
              <FloodMap dam={activeDam} simulationResult={simulationResult} heightClass="h-[750px]" />
            </div>
          )}

          {activeTab === 'simulator' && (
            <Simulator
              currentParams={simulationParams}
              onRunSimulation={handleRunSimulation}
              simulationResult={simulationResult}
              selectedDamId={selectedDamId}
              onSelectDam={handleSelectDam}
            />
          )}

          {activeTab === 'comparison' && <ScenarioComparison />}

          {activeTab === 'airisk' && (
            <AiRiskAssessment dam={activeDam} simulationResult={simulationResult} />
          )}

          {activeTab === 'arrival' && (
            <ArrivalPrediction dam={activeDam} simulationResult={simulationResult} />
          )}

          {activeTab === 'evacuation' && (
            <EvacuationRouting simulationResult={simulationResult} />
          )}

          {activeTab === 'infra' && (
            <Infrastructure simulationResult={simulationResult} />
          )}

          {activeTab === 'monitoring' && <LiveMonitoring />}

          {activeTab === 'satellite' && <SatelliteMonitoring />}

          {activeTab === 'alerts' && (
            <AlertSystem
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onTriggerAlertBroadcast={handleTriggerAlertBroadcast}
            />
          )}

          {activeTab === 'priority' && <ResponsePriority />}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
              >
                Open Full Screen Report Modal
              </button>
            </div>
          )}

          {activeTab === 'architecture' && <SystemArchitecture />}

          {activeTab === 'datasources' && <DataSources />}
        </main>

      </div>

      {/* Printable Report Modal */}
      {isReportOpen && (
        <ReportGenerator
          dam={activeDam}
          simulationParams={simulationParams}
          simulationResult={simulationResult}
          onClose={() => setIsReportOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
