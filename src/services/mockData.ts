import { 
  ScenarioComparisonEntry, 
  AiRiskDirective, 
  AlertItem, 
  EvacuationRoute, 
  ResponsePriorityItem,
  TelemetryReading
} from '../types';

export const PRESET_SCENARIOS: ScenarioComparisonEntry[] = [
  {
    id: 'sc-1',
    name: 'Scenario A: Piping Leak Failure',
    breachType: 'Internal Piping Erosion',
    breachWidth: 60,
    breachDepth: 25,
    waterLevel: 828,
    inundationAreaKm2: 84,
    maxDepthMeters: 2.8,
    arrivalMinutesRishikesh: 110,
    populationAffected: 38400,
    infrastructureCount: 4,
    economicImpactCr: 450
  },
  {
    id: 'sc-2',
    name: 'Scenario B: Overtopping Spillway Breach',
    breachType: 'Overtopping Structural Failure',
    breachWidth: 150,
    breachDepth: 55,
    waterLevel: 832,
    inundationAreaKm2: 245,
    maxDepthMeters: 5.6,
    arrivalMinutesRishikesh: 68,
    populationAffected: 118200,
    infrastructureCount: 9,
    economicImpactCr: 1850
  },
  {
    id: 'sc-3',
    name: 'Scenario C: Catastrophic Seismic Dam Collapse',
    breachType: 'Instantaneous Total Failure',
    breachWidth: 320,
    breachDepth: 85,
    waterLevel: 835,
    inundationAreaKm2: 512,
    maxDepthMeters: 11.4,
    arrivalMinutesRishikesh: 38,
    populationAffected: 215000,
    infrastructureCount: 16,
    economicImpactCr: 5400
  }
];

export const INITIAL_AI_DIRECTIVES: AiRiskDirective[] = [
  {
    id: 'ai-1',
    sector: 'Rishikesh Sector 1 (Laxman Jhula & Tapovan)',
    riskScore: 94,
    hazardCategory: 'CRITICAL',
    keyImpact: 'Submersion depth expected > 4.5m with fast turbulent current (4.8 m/s). NH-58 link inundated.',
    actionRequired: 'Initiate mandatory siren evacuations immediately to High Elevation Relief Camps.',
    timeframe: 'Evacuate within 45 minutes'
  },
  {
    id: 'ai-2',
    sector: 'Devprayag River Confluence Point',
    riskScore: 88,
    hazardCategory: 'CRITICAL',
    keyImpact: 'Bhagirathi & Alaknanda junction backing up; flood wave height +6.2m over normal stage.',
    actionRequired: 'Deploy NDRF Team 4 for amphibious boat evacuation along river banks.',
    timeframe: 'Evacuate within 30 minutes'
  },
  {
    id: 'ai-3',
    sector: 'Shivpuri Riverfront & Adventure Camps',
    riskScore: 76,
    hazardCategory: 'HIGH',
    keyImpact: 'Rafting beach and lower camp structures 100% submerged. Road connectivity disrupted.',
    actionRequired: 'Move tourists and residents 80m above current river stage via bypass trail.',
    timeframe: 'Evacuate within 60 minutes'
  },
  {
    id: 'ai-4',
    sector: 'Muni Ki Reti & Rishikesh City Center',
    riskScore: 62,
    hazardCategory: 'MODERATE',
    keyImpact: 'Urban street drainage surcharge and low-lying residential flooding (0.8m - 1.5m depth).',
    actionRequired: 'Issue PA warnings; shut down lower electric substations to prevent grid electrocution.',
    timeframe: 'Prepare within 90 minutes'
  }
];

export const MOCK_TELEMETRY_STREAM: TelemetryReading[] = [
  { timestamp: '13:00', reservoirLevel: 830.1, spillwayDischarge: 1200, downstreamStage: 4.2, rainfallRate: 12, acousticVelocity: 2.1 },
  { timestamp: '13:05', reservoirLevel: 830.4, spillwayDischarge: 1450, downstreamStage: 4.5, rainfallRate: 24, acousticVelocity: 2.4 },
  { timestamp: '13:10', reservoirLevel: 831.2, spillwayDischarge: 2100, downstreamStage: 5.1, rainfallRate: 45, acousticVelocity: 3.0 },
  { timestamp: '13:15', reservoirLevel: 832.0, spillwayDischarge: 3800, downstreamStage: 6.4, rainfallRate: 68, acousticVelocity: 4.2 },
  { timestamp: '13:20', reservoirLevel: 831.5, spillwayDischarge: 8500, downstreamStage: 8.9, rainfallRate: 85, acousticVelocity: 6.5 },
  { timestamp: '13:25', reservoirLevel: 829.8, spillwayDischarge: 14200, downstreamStage: 11.2, rainfallRate: 92, acousticVelocity: 8.4 },
  { timestamp: '13:30', reservoirLevel: 827.1, spillwayDischarge: 18900, downstreamStage: 13.8, rainfallRate: 75, acousticVelocity: 9.8 }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-101',
    severity: 'CRITICAL',
    title: 'Dam Breach Simulation Triggered',
    location: 'Tehri Hydroelectric Complex',
    time: '2 mins ago',
    message: 'Hydrodynamic model predicts downstream peak wave arrival at Rishikesh within 52 minutes.',
    recommendedAction: 'Sound District Emergency Warning Sirens & Activate DDMA Emergency Control Room.',
    acknowledged: false
  },
  {
    id: 'alt-102',
    severity: 'HIGH',
    title: 'NH-58 Road Inundation Warning',
    location: 'Devprayag - Rishikesh Sector',
    time: '7 mins ago',
    message: 'National Highway 58 at KM 34 expected submerged under 2.4m water flow at T+40 min.',
    recommendedAction: 'Reroute traffic through Chamba-Mussoorie State Highway.',
    acknowledged: false
  },
  {
    id: 'alt-103',
    severity: 'HIGH',
    title: 'AIIMS Rishikesh Lower Wing Alert',
    location: 'AIIMS Rishikesh Campus',
    time: '12 mins ago',
    message: 'Ground level power generators vulnerable to river stage backwater rise.',
    recommendedAction: 'Activate auxiliary rooftop diesel gensets & move ICU units to Floor 3+.',
    acknowledged: true
  },
  {
    id: 'alt-104',
    severity: 'WARNING',
    title: 'Heavy Upstream Catchment Rainfall',
    location: 'Bhagirathi Upper Catchment',
    time: '25 mins ago',
    message: 'IMD Automatic Weather Station records 95 mm/hr cloudburst-like precipitation.',
    recommendedAction: 'Monitor reservoir inflow rate telemetry every 5 minutes.',
    acknowledged: true
  }
];

export const EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    villageId: 'v-5',
    villageName: 'Rishikesh (Laxman Jhula Sector)',
    shelterId: 'inf-9',
    shelterName: 'IDPL Relief Staging Grounds',
    distanceKm: 6.4,
    estTravelTimeMins: 22,
    timeMarginMins: 30, // 52 - 22
    routeRisk: 'LOW',
    status: 'RECOMMENDED',
    waypoints: [
      [30.1264, 78.3249],
      [30.1150, 78.3100],
      [30.0900, 78.2900],
      [30.0645, 78.2712]
    ]
  },
  {
    villageId: 'v-4',
    villageName: 'Devprayag Confluence Town',
    shelterId: 'inf-12',
    shelterName: 'Devprayag Higher Ground Secondary School Shelter',
    distanceKm: 3.2,
    estTravelTimeMins: 14,
    timeMarginMins: 18,
    routeRisk: 'MODERATE',
    status: 'CAUTION',
    waypoints: [
      [30.1460, 78.5986],
      [30.1510, 78.6010],
      [30.1580, 78.6050]
    ]
  },
  {
    villageId: 'v-3',
    villageName: 'Shivpuri Riverbank Settlement',
    shelterId: 'inf-9',
    shelterName: 'Chamba Ridge Emergency Camp',
    distanceKm: 12.8,
    estTravelTimeMins: 35,
    timeMarginMins: -7, // negative margin, urgent evacuation required
    routeRisk: 'HIGH',
    status: 'IMPASSABLE',
    waypoints: [
      [30.1362, 78.3892],
      [30.2000, 78.3900],
      [30.3312, 78.3910]
    ]
  }
];

export const RESPONSE_PRIORITIES: ResponsePriorityItem[] = [
  {
    priorityRank: 1,
    sectorName: 'Sector Alpha: Devprayag & Shivpuri Reach',
    populationAtRisk: 17400,
    expectedDepth: 5.8,
    arrivalTime: 28,
    urgencyLevel: 'CRITICAL',
    assignedNDRFUnits: 4,
    rescueBoatsRequired: 18,
    medicalTeamsAssigned: 6,
    shelterDestination: 'Chamba Ridge & Devprayag College'
  },
  {
    priorityRank: 2,
    sectorName: 'Sector Bravo: Rishikesh Laxman Jhula & Tapovan',
    populationAtRisk: 48500,
    expectedDepth: 4.2,
    arrivalTime: 52,
    urgencyLevel: 'CRITICAL',
    assignedNDRFUnits: 6,
    rescueBoatsRequired: 35,
    medicalTeamsAssigned: 12,
    shelterDestination: 'IDPL Relief Staging Grounds'
  },
  {
    priorityRank: 3,
    sectorName: 'Sector Charlie: Muni Ki Reti & Sub-District Center',
    populationAtRisk: 22100,
    expectedDepth: 2.4,
    arrivalTime: 68,
    urgencyLevel: 'HIGH',
    assignedNDRFUnits: 3,
    rescueBoatsRequired: 12,
    medicalTeamsAssigned: 5,
    shelterDestination: 'Rishikesh Government Stadium'
  },
  {
    priorityRank: 4,
    sectorName: 'Sector Delta: Haridwar Downstream Plains',
    populationAtRisk: 68000,
    expectedDepth: 1.2,
    arrivalTime: 125,
    urgencyLevel: 'MODERATE',
    assignedNDRFUnits: 5,
    rescueBoatsRequired: 15,
    medicalTeamsAssigned: 8,
    shelterDestination: 'Haridwar Exhibition Grounds'
  }
];
