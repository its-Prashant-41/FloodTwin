import { SimulationParams, SimulationResult, VillageAtRisk, InfrastructureAsset, HydrographPoint, DamSystem } from '../types';

export const DAMS_REGISTRY: Record<string, DamSystem> = {
  tehri: {
    id: 'tehri',
    name: 'Tehri Dam Digital Twin',
    river: 'Bhagirathi / Ganga River System',
    locationName: 'Tehri Garhwal, Uttarakhand',
    state: 'Uttarakhand',
    lat: 30.3781,
    lng: 78.4803,
    maxWaterLevel: 835,
    currentWaterLevel: 830,
    normalStorageVolume: 3540, // MCM
    maxDischargeCapacity: 15500, // m3/s
    height: 260.5, // highest dam in India
    crestLength: 575,
    defaultBreachWidth: 140,
    defaultBreachDepth: 55,
    defaultFormationTime: 45,
  },
  hirakud: {
    id: 'hirakud',
    name: 'Hirakud Dam Digital Twin',
    river: 'Mahanadi River Basin',
    locationName: 'Sambalpur, Odisha',
    state: 'Odisha',
    lat: 21.5700,
    lng: 83.8700,
    maxWaterLevel: 192,
    currentWaterLevel: 190,
    normalStorageVolume: 5896, // MCM
    maxDischargeCapacity: 42450, // m3/s
    height: 60.9,
    crestLength: 4800,
    defaultBreachWidth: 220,
    defaultBreachDepth: 35,
    defaultFormationTime: 60,
  },
  sardar_sarovar: {
    id: 'sardar_sarovar',
    name: 'Sardar Sarovar Dam Twin',
    river: 'Narmada River System',
    locationName: 'Kevadia, Gujarat',
    state: 'Gujarat',
    lat: 21.8322,
    lng: 73.7486,
    maxWaterLevel: 138.68,
    currentWaterLevel: 136.5,
    normalStorageVolume: 9500, // MCM
    maxDischargeCapacity: 84950, // m3/s
    height: 163,
    crestLength: 1210,
    defaultBreachWidth: 180,
    defaultBreachDepth: 45,
    defaultFormationTime: 50,
  }
};

export function runHydrodynamicSimulation(params: SimulationParams): SimulationResult {
  const dam = DAMS_REGISTRY[params.damId] || DAMS_REGISTRY['tehri'];

  // Calculate breach discharge peak using simplified hydrodynamic formula Q = C * B * H^1.5 + rainfall factor
  const hydraulicHead = Math.max(10, params.waterLevel - (dam.maxWaterLevel - dam.height));
  const basePeakQ = 1.4 * params.breachWidth * Math.pow(params.breachDepth, 1.4);
  const volumeMultiplier = Math.pow(params.reservoirStorage / 1000, 0.35);
  const rainfallQ = params.rainfallIntensity * 45; // additional runoff
  
  const peakDischargeM3s = Math.round(params.releaseDischargeRate + basePeakQ * volumeMultiplier + rainfallQ);

  // Inundation area scaling
  const inundationAreaKm2 = Math.round((peakDischargeM3s / 120) * (params.simulationDuration / 6));
  const maxDepthMeters = parseFloat((Math.min(18, 2.5 + (peakDischargeM3s / 4500))).toFixed(1));
  const maxVelocityMs = parseFloat((Math.min(14, 1.8 + (peakDischargeM3s / 6000))).toFixed(1));

  // Downstream speed factor
  const speedFactor = (peakDischargeM3s / 15000);

  // Generate hydrograph timeline
  const hydrograph: HydrographPoint[] = [];
  const totalMinutes = params.simulationDuration * 60;
  const step = Math.max(15, Math.floor(totalMinutes / 12));
  
  for (let t = 0; t <= totalMinutes; t += step) {
    let q = 0;
    if (t < params.breachFormationTime) {
      q = params.releaseDischargeRate + (peakDischargeM3s - params.releaseDischargeRate) * Math.pow(t / params.breachFormationTime, 2);
    } else {
      const decayTime = t - params.breachFormationTime;
      q = peakDischargeM3s * Math.exp(-decayTime / 180);
    }
    hydrograph.push({
      time: Math.round(t / 60 * 10) / 10,
      discharge: Math.round(q),
      waterStage: parseFloat((Math.min(maxDepthMeters, (q / peakDischargeM3s) * maxDepthMeters)).toFixed(1))
    });
  }

  // Calculate dynamically affected villages based on Tehri-Ganga basin coordinates
  const baseVillages: { name: string; lat: number; lng: number; baseDistKm: number; elevation: number; basePop: number }[] = [
    { name: 'Koti Village & Reservoir Rim', lat: 30.3892, lng: 78.4721, baseDistKm: 4.2, elevation: 840, basePop: 1850 },
    { name: 'Chamba Sector 4', lat: 30.3341, lng: 78.3984, baseDistKm: 14.5, elevation: 760, basePop: 6400 },
    { name: 'Shivpuri Riverbank Settlement', lat: 30.1362, lng: 78.3892, baseDistKm: 28.0, elevation: 410, basePop: 3200 },
    { name: 'Devprayag Confluence Town', lat: 30.1460, lng: 78.5986, baseDistKm: 38.5, elevation: 470, basePop: 14200 },
    { name: 'Rishikesh (Laxman Jhula Sector)', lat: 30.1264, lng: 78.3249, baseDistKm: 52.0, elevation: 340, basePop: 48500 },
    { name: 'Tapasya Nagar & Muni Ki Reti', lat: 30.1142, lng: 78.3090, baseDistKm: 56.2, elevation: 335, basePop: 22100 },
    { name: 'Haridwar (Harki Pauri Sector)', lat: 29.9567, lng: 78.1709, baseDistKm: 76.4, elevation: 290, basePop: 68000 }
  ];

  const villages: VillageAtRisk[] = baseVillages.map((v, i) => {
    // Wave travel time approximation: t = dist / (velocity * 3.6)
    const effectiveVel = Math.max(2.5, maxVelocityMs * Math.exp(-v.baseDistKm / 120));
    const travelTimeMins = Math.max(12, Math.round((v.baseDistKm * 60) / (effectiveVel * 3.6 * Math.max(0.7, speedFactor))));
    const localDepth = parseFloat((Math.max(0.4, maxDepthMeters * Math.exp(-v.baseDistKm / 85))).toFixed(1));
    const localVel = parseFloat((effectiveVel).toFixed(1));

    let risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    if (localDepth > 4.0 || travelTimeMins < 45) risk = 'CRITICAL';
    else if (localDepth > 2.0 || travelTimeMins < 90) risk = 'HIGH';
    else if (localDepth > 0.8) risk = 'MODERATE';

    return {
      id: `v-${i + 1}`,
      name: v.name,
      lat: v.lat,
      lng: v.lng,
      distanceFromDam: v.baseDistKm,
      elevation: v.elevation,
      population: v.basePop,
      arrivalTimeMinutes: travelTimeMins,
      maxDepthMeters: localDepth,
      flowVelocity: localVel,
      riskLevel: risk,
      evacuationStatus: travelTimeMins < 45 ? 'IN_PROGRESS' : 'PENDING'
    };
  });

  // Calculate infrastructure assets
  const baseInfra: { name: string; cat: InfrastructureAsset['category']; lat: number; lng: number; distBank: number; phone: string; capacity?: number }[] = [
    { name: 'AIIMS Rishikesh Emergency Wing', cat: 'Hospital', lat: 30.0768, lng: 78.2878, distBank: 420, phone: '+91 135 246 2000', capacity: 650 },
    { name: 'Sub-District Civil Hospital Rishikesh', cat: 'Hospital', lat: 30.1012, lng: 78.2954, distBank: 180, phone: '+91 135 243 0122', capacity: 150 },
    { name: 'Laxman Jhula Suspension Bridge', cat: 'Bridge', lat: 30.1238, lng: 78.3276, distBank: 10, phone: 'N/A' },
    { name: 'Ram Jhula Pedestrian Span', cat: 'Bridge', lat: 30.1189, lng: 78.3142, distBank: 15, phone: 'N/A' },
    { name: 'National Highway 58 (Rishikesh Bypass)', cat: 'Road', lat: 30.1088, lng: 78.3011, distBank: 80, phone: 'NHAI Control' },
    { name: 'Tehri Hydroelectric Power House (2400 MW)', cat: 'Power Plant', lat: 30.3712, lng: 78.4764, distBank: 50, phone: '+91 1376 232 400' },
    { name: 'Chamba Secondary Electric Substation', cat: 'Power Plant', lat: 30.3312, lng: 78.3910, distBank: 240, phone: '+91 1376 255 101' },
    { name: 'Rishikesh Government Inter College', cat: 'School', lat: 30.1044, lng: 78.2912, distBank: 310, phone: '+91 135 243 4455' },
    { name: 'IDPL Safe Shelter & Relief Staging Grounds', cat: 'Shelter', lat: 30.0645, lng: 78.2712, distBank: 1100, phone: '+91 135 245 8890', capacity: 12000 },
    { name: 'Pashulok Barrage Protection Works', cat: 'Bridge', lat: 30.0712, lng: 78.2911, distBank: 25, phone: '+91 135 243 1100' },
    { name: 'Muni Ki Reti Primary Health Center', cat: 'Hospital', lat: 30.1190, lng: 78.3040, distBank: 140, phone: '+91 135 243 9088', capacity: 40 },
    { name: 'Haridwar Stadium Relief Center', cat: 'Shelter', lat: 29.9488, lng: 78.1590, distBank: 950, phone: '+91 1334 227 400', capacity: 18000 }
  ];

  const infrastructure: InfrastructureAsset[] = baseInfra.map((item, idx) => {
    // Map to nearest village arrival time
    const villageRef = villages.find(v => Math.abs(v.lat - item.lat) < 0.1) || villages[3];
    const expDepth = Math.max(0, parseFloat((villageRef.maxDepthMeters * Math.max(0.1, (600 - item.distBank) / 600)).toFixed(1)));
    
    let status: InfrastructureAsset['status'] = 'SAFE';
    if (expDepth > 2.5) status = 'INUNDATED';
    else if (expDepth > 0.3) status = 'AT_RISK';

    return {
      id: `inf-${idx + 1}`,
      name: item.name,
      category: item.cat,
      lat: item.lat,
      lng: item.lng,
      distanceFromRiverBank: item.distBank,
      estimatedArrivalMinutes: villageRef.arrivalTimeMinutes,
      expectedDepthMeters: expDepth,
      status,
      capacity: item.capacity,
      contactPhone: item.phone
    };
  });

  const affectedPopulation = villages.reduce((sum, v) => sum + (v.maxDepthMeters > 0.5 ? v.population : 0), 0);
  const villagesAffectedCount = villages.filter(v => v.maxDepthMeters > 0.5).length;
  const criticalInfraAffectedCount = infrastructure.filter(i => i.status !== 'SAFE').length;

  let overallRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
  if (peakDischargeM3s > 25000 || maxDepthMeters > 6.0) overallRisk = 'CRITICAL';
  else if (peakDischargeM3s > 12000 || maxDepthMeters > 3.0) overallRisk = 'HIGH';

  return {
    inundationAreaKm2,
    maxDepthMeters,
    maxVelocityMs,
    peakDischargeM3s,
    affectedPopulation,
    villagesAffectedCount,
    criticalInfraAffectedCount,
    hydrograph,
    villages,
    infrastructure,
    overallRisk,
    timestamp: new Date().toLocaleTimeString()
  };
}
