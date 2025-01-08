export type StandardRateRowData = {
  byRoute: string[];
  byWeightBreak: string[];
};

export type ParsedStandardRateData = {
  contractNumber: string;
  tAndCCode: string;
  bySolution: string[];
  byRoute: string[];
  byWeightBreak: string[];
  realData: StandardRateRowData[];
};

export type ParsedStandardRateRowData = {
  id: string;
  origin: string;
  region: string;
  country: string;
  destination: string;
  effectiveDate: string;
  solution: string;
  weightBreak: string;
  rate: string;
};

export type ParsedStandardRateFormulaData = {
  contractNumber: string;
  tAndCCode: string;
  bySolution: string[];
  byRoute: string[];
  byWeightBreak: string[];
  realData: StandardRateRowData[];
};

export type ParsedStandardRateFormulaRowData = {
  id: string;
  origin: string;
  region: string;
  country: string;
  destination: string;
  effectiveDate: string;
  solution: string;
  weightBreak: string;
  formula: string;
};

export type ParsedRateRationaleData = {
  bySolution: string[];
  byRoute: string[];
  byWeightBreak: string[];
  realData: StandardRateRowData[];
};

export type ParsedRateRationaleRowData = {
  id: string;
  origin: string;
  region: string;
  country: string;
  destination: string;
  effectiveDate: string;
  solution: string;
  weightBreak: string;
  factor: string;
};
