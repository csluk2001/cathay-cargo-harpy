// Raw Data from Excel
interface StandardRateRawData {
  portCount: number;
  contractNumber: string;
  tNcCode: string;
  solutionAndEffectiveDate: Record<string, string>[];
  routeAndWeightbreak: Record<string, string>[];
  pricing: Record<string, string>[];
}

interface StandardRateCompact {
  id: string;
  originRegion: string;
  originCountry: string;
  originAirport: string;
  destRegion: string;
  destCountry: string;
  destAirport: string;
  solutionWeightbreakPriceMap: {
    solution: string;
    weightbreak: string;
    price: number;
    formula: string;
  }[];
  effectiveDate: string;
}

interface StandardRateOneLine {
  id: string;
  originRegion: string;
  originCountry: string;
  originAirport: string;
  destRegion: string;
  destCountry: string;
  destAirport: string;
  solution: string;
  weightbreak: string;
  price: number;
  formula: string;
  effectiveDate: string;
}

interface StandardRateTable {
  contractNumber: string;
  tNcCode: string;
  standardRateCompactSet: StandardRateCompact[];
}
