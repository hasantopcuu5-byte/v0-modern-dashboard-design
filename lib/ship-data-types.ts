export interface ShipFormData {
  operation: string;
  cargo: string;
  dateTime: string;
  steamingTime: number;
  distanceCoveredOwner: number;
  distanceCoveredCharterer: number;
  dailyLogDistance: number;
  avgRpm: number;
  orderedSpeed: number;
  dailyLogDistanceOwner: number;
  meSlipPercent: number;
  charterpartyTerm: string;
  cargoQuantity: number;

  meLoadPercent: number;
  meDailyRunningHrs: number;
  boilerDailyHrs: number;
  dgDailyRhsNo1: number;
  dgDailyRhsNo2: number;
  dgDailyRhsNo3: number;
  dgTotalPowerKw: number;
  isOfficeInformed: boolean;
  eplStatus: boolean;

  ownerActualVlsfoBoiler: number;
  ownerActualVlsfoDg: number;
  ownerActualVlsfoMe: number;
  ownerActualLsmgoBoiler: number;
  ownerActualLsmgoDg: number;
  ownerActualLsmgoMe: number;

  chartererAllowedVlsfoBoiler: number;
  chartererAllowedVlsfoDg: number;
  chartererAllowedVlsfoMe: number;
  chartererAllowedLsmgoBoiler: number;
  chartererAllowedLsmgoDg: number;
  chartererAllowedLsmgoMe: number;

  meSysOil: number;
  meCylOil: number;
  aeSysOil: number;
  slop: number;
  sludge: number;
  sewage: number;
  bilge: number;
  freshWater: number;
  garbage: number;

  vlsfoSupply: number;
  lsmgoSupply: number;

  weatherOwnerWind: number;
  weatherOwnerSwell: number;
  weatherOwnerSeaState: string;
  weatherOwnerAdverseCurrent: number;

  weatherChartererWind: number;
  weatherChartererSwell: number;
  weatherChartererSeaState: string;

  weatherRoutingWind: number;
  weatherRoutingSwell: number;
  weatherRoutingSeaState: string;
  remarks?: string;
}

export interface CospData {
  vlsfoInitial: number;
  lsmgoInitial: number;
}

export const defaultFormData: ShipFormData = {
  operation: "at-sea",
  cargo: "",
  dateTime: new Date().toISOString().slice(0, 16),
  steamingTime: 24,
  distanceCoveredOwner: 312.5,
  distanceCoveredCharterer: 308.2,
  dailyLogDistance: 312.5,
  avgRpm: 85,
  orderedSpeed: 13.5,
  dailyLogDistanceOwner: 312.5,
  meSlipPercent: 2.5,
  charterpartyTerm: "Time Charter",
  cargoQuantity: 45000,
  meLoadPercent: 75,
  meDailyRunningHrs: 24,
  boilerDailyHrs: 4.5,
  dgDailyRhsNo1: 24,
  dgDailyRhsNo2: 0,
  dgDailyRhsNo3: 0,
  dgTotalPowerKw: 450,
  isOfficeInformed: false,
  eplStatus: true,
  ownerActualVlsfoBoiler: 0.8,
  ownerActualVlsfoDg: 2.1,
  ownerActualVlsfoMe: 28.5,
  ownerActualLsmgoBoiler: 0,
  ownerActualLsmgoDg: 0.5,
  ownerActualLsmgoMe: 0,
  chartererAllowedVlsfoBoiler: 1.0,
  chartererAllowedVlsfoDg: 2.5,
  chartererAllowedVlsfoMe: 30.0,
  chartererAllowedLsmgoBoiler: 0,
  chartererAllowedLsmgoDg: 0.6,
  chartererAllowedLsmgoMe: 0,
  meSysOil: 15,
  meCylOil: 45,
  aeSysOil: 5,
  slop: 0.2,
  sludge: 0.5,
  sewage: 1.2,
  bilge: 0.8,
  freshWater: 8,
  garbage: 0.3,
  vlsfoSupply: 0,
  lsmgoSupply: 0,
  weatherOwnerWind: 15,
  weatherOwnerSwell: 2.0,
  weatherOwnerSeaState: "moderate",
  weatherOwnerAdverseCurrent: -0.5,
  weatherChartererWind: 15,
  weatherChartererSwell: 2.0,
  weatherChartererSeaState: "moderate",
  weatherRoutingWind: 12,
  weatherRoutingSwell: 1.5,
  weatherRoutingSeaState: "slight",
  remarks: "",
};

export const defaultCospData: CospData = {
  vlsfoInitial: 1250,
  lsmgoInitial: 320,
};

export const seaStateOptions = [
  { value: "calm", label: "Calm (0-1)" },
  { value: "slight", label: "Slight (2)" },
  { value: "moderate", label: "Moderate (3-4)" },
  { value: "rough", label: "Rough (5-6)" },
  { value: "very-rough", label: "Very Rough (7-8)" },
  { value: "high", label: "High (9+)" },
];

export const operationOptions = [
  { value: "at-sea", label: "At Sea" },
  { value: "maneuvering", label: "Maneuvering" },
  { value: "at-anchor", label: "At Anchor" },
  { value: "in-port", label: "In Port" },
  { value: "drifting", label: "Drifting" },
];
