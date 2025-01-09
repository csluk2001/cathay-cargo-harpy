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

// Rate
export type ParsedStandardRateRowData = {
	cellId: string;
	rowId: string;
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

// Formula
export type ParsedStandardRateFormulaRowData = {
	cellId: string;
	rowId: string;
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

// Rate Rationale
export type ParsedRateRationaleRowData = {
	cellId: string;
	rowId: string;
	origin: string;
	region: string;
	country: string;
	destination: string;
	effectiveDate: string;
	solution: string;
	weightBreak: string;
	factor: string;
};

// Rate + Formula
export type ParsedStandardRateWithFormulaRowData = {
	cellId: string;
	rowId: string;
	origin: string;
	region: string;
	country: string;
	destination: string;
	effectiveDate: string;
	solution: string;
	weightBreak: string;
	rate: string;
	formula: string;
	translatedFormula: string;
};
