export type DamId = 'tehri' | 'hirakud' | 'sardar_sarovar';

export interface DamSystem {
  id: DamId;
  name: string;
  river: string;
  locationName: string;
  state: string;
  lat: number;
  lng: number;
  maxWaterLevel: number; // m above MSL
  currentWaterLevel: number; // m
  normalStorageVolume: number; // MCM
  maxDischargeCapacity: number; // m^3/s
  height: number; // m
  crestLength: number; // m
  defaultBreachWidth: number; // m
  defaultBreachDepth: number; // m
  defaultFormationTime: number; // mins
}

export interface SimulationParams {
  damId: DamId;
  waterLevel: number; // m
  reservoirStorage: number; // MCM
  breachWidth: number; // m
  breachDepth: number; // m
  breachFormationTime: number; // mins
  releaseDischargeRate: number; // m^3/s
  rainfallIntensity: number; // mm/hr
  simulationDuration: number; // hours
}

export interface HydrographPoint {
  time: number; // hours or minutes
  discharge: number; // m^3/s
  waterStage: number; // m depth
}

export interface VillageAtRisk {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceFromDam: number; // km
  elevation: number; // m MSL
  population: number;
  arrivalTimeMinutes: number;
  maxDepthMeters: number;
  flowVelocity: number; // m/s
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  evacuationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ISOLATED';
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  category: 'Hospital' | 'School' | 'Bridge' | 'Road' | 'Power Plant' | 'Shelter';
  lat: number;
  lng: number;
  distanceFromRiverBank: number; // meters
  estimatedArrivalMinutes: number;
  expectedDepthMeters: number;
  status: 'SAFE' | 'AT_RISK' | 'INUNDATED' | 'EVACUATED';
  capacity?: number; // for shelters or hospitals
  contactPhone?: string;
}

export interface SimulationResult {
  inundationAreaKm2: number;
  maxDepthMeters: number;
  maxVelocityMs: number;
  peakDischargeM3s: number;
  affectedPopulation: number;
  villagesAffectedCount: number;
  criticalInfraAffectedCount: number;
  hydrograph: HydrographPoint[];
  villages: VillageAtRisk[];
  infrastructure: InfrastructureAsset[];
  overallRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  timestamp: string;
}

export interface ScenarioComparisonEntry {
  id: string;
  name: string;
  breachType: string;
  breachWidth: number;
  breachDepth: number;
  waterLevel: number;
  inundationAreaKm2: number;
  maxDepthMeters: number;
  arrivalMinutesRishikesh: number;
  populationAffected: number;
  infrastructureCount: number;
  economicImpactCr: number;
}

export interface AiRiskDirective {
  id: string;
  sector: string;
  riskScore: number; // 0-100
  hazardCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  keyImpact: string;
  actionRequired: string;
  timeframe: string;
}

export interface TelemetryReading {
  timestamp: string;
  reservoirLevel: number; // m
  spillwayDischarge: number; // m3/s
  downstreamStage: number; // m
  rainfallRate: number; // mm/hr
  acousticVelocity: number; // m/s
}

export interface AlertItem {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  title: string;
  location: string;
  time: string;
  message: string;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface EvacuationRoute {
  villageId: string;
  villageName: string;
  shelterId: string;
  shelterName: string;
  distanceKm: number;
  estTravelTimeMins: number;
  timeMarginMins: number; // arrivalTime - estTravelTime
  routeRisk: 'LOW' | 'MODERATE' | 'HIGH';
  status: 'RECOMMENDED' | 'CAUTION' | 'IMPASSABLE';
  waypoints: [number, number][];
}

export interface ResponsePriorityItem {
  priorityRank: number; // 1, 2, 3...
  sectorName: string;
  populationAtRisk: number;
  expectedDepth: number;
  arrivalTime: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  assignedNDRFUnits: number;
  rescueBoatsRequired: number;
  medicalTeamsAssigned: number;
  shelterDestination: string;
}
