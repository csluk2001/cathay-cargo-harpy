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

// export type ParsedStandardRateRowData = {
// 	route: {
// 		origin: string;
// 		region: string;
// 		country: string;
// 		dest: string;
// 		effectiveDate: Date;
// 	};
// 	rateBySolutionAndWeightBreak: Array<{
// 		solution: string;
// 		weightBreak: string;
// 		rate: string;
// 	}>;
// };
