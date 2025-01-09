import {
	ParsedStandardRateData,
	ParsedStandardRateRowData,
	ParsedRateRationaleData,
	ParsedRateRationaleRowData,
	ParsedStandardRateWithFormulaRowData,
	ParsedStandardRateFormulaRowData,
	ParsedStandardRateFormulaData,
} from "@/types/ParsedCsvData";
import ExcelHandler from "@/utils/ExcelHandler";
import { create } from "zustand";

interface UploadedSheet {
	sheetName: string;
	status: "Ready" | "Error";
}

interface UploadedSheetState {
	sheetNameArray: string[];
	status: ("Ready" | "Error")[];
	sheetData: ParsedStandardRateData[];
	sheetRowData: ParsedStandardRateRowData[];
	sheetFormulaData: ParsedStandardRateFormulaData[];
	sheetFormulaRowData: ParsedStandardRateFormulaRowData[];
	rateRationaleData: ParsedRateRationaleData[];
	rateRationaleRowData: ParsedRateRationaleRowData[];
	standardRateWithFormulaRowData: ParsedStandardRateWithFormulaRowData[];
	updateUploadedSheetData: (
		uploadedSheet: UploadedSheet,
		data: ParsedStandardRateData
	) => void;
	castSheetStandardRateDataToSheetRowData: () => void;
	castSheetStandardRateFormulaDataToSheetRowData: () => void;
	castSheetRateRationaleDataToSheetRowData: () => void;
}

const useUploadedCsvStore = create<UploadedSheetState>((set, get) => ({
	sheetNameArray: [],
	status: [],
	sheetData: [],
	sheetRowData: [],
	sheetFormulaData: [],
	sheetFormulaRowData: [],
	rateRationaleData: [],
	rateRationaleRowData: [],
	standardRateWithFormulaRowData: [],
	updateUploadedSheetData: (uploadedSheet: UploadedSheet, parsedData) => {
		const state = get();

		// Check if the sheet name is already in the array
		if (!state.sheetNameArray.includes(uploadedSheet.sheetName)) {
			set((state) => ({
				...state,
				sheetNameArray: [
					...state.sheetNameArray,
					uploadedSheet.sheetName,
				],
				status: [...state.status, uploadedSheet.status],
				sheetData: [...state.sheetData, parsedData],
			}));
		}
	},
	castSheetStandardRateDataToSheetRowData: () => {
		set((state) => {
			const standardRateRowDataArray: ParsedStandardRateRowData[] = [];
			const standardRateWithFormulaRowDataArray: ParsedStandardRateWithFormulaRowData[] =
				[];

			for (let i = 0; i < state.sheetNameArray.length; i++) {
				if (
					state.sheetNameArray[i].trim().toLowerCase() ===
					"standard rate (rm)"
				) {
					const tempSheetData = state.sheetData[i];
					// Debug
					// console.log(tempSheetData);

					for (let j = 0; j < tempSheetData.realData.length; j++) {
						for (
							let k = 0;
							k < tempSheetData.bySolution.length;
							k++
						) {
							// Create a new instance of the object for each iteration
							const tempStandardRateRowData = {
								cellId:
									ExcelHandler.generateCellId(k + 5) +
									(j + 3),
								rowId:
									tempSheetData.realData[j].byRoute[0] +
									"-" +
									tempSheetData.realData[j].byRoute[3] +
									"-" +
									tempSheetData.bySolution[k] +
									"-" +
									tempSheetData.byWeightBreak[k],
								origin: tempSheetData.realData[j].byRoute[0],
								region: tempSheetData.realData[j].byRoute[1],
								country: tempSheetData.realData[j].byRoute[2],
								destination:
									tempSheetData.realData[j].byRoute[3],
								solution: tempSheetData.bySolution[k],
								weightBreak: tempSheetData.byWeightBreak[k],
								rate: tempSheetData.realData[j].byWeightBreak[
									k
								],
								effectiveDate:
									tempSheetData.realData[j].byWeightBreak[
										tempSheetData.realData[j].byWeightBreak
											.length - 1
									],
							};

							// Debug
							// console.log(tempStandardRateRowData.effectiveDate);

							const tempStandardRateWithFormulaRowData = {
								cellId:
									ExcelHandler.generateCellId(k + 5) +
									(j + 3),
								rowId:
									tempSheetData.realData[j].byRoute[0] +
									"-" +
									tempSheetData.realData[j].byRoute[3] +
									"-" +
									tempSheetData.bySolution[k] +
									"-" +
									tempSheetData.byWeightBreak[k],
								origin: tempSheetData.realData[j].byRoute[0],
								region: tempSheetData.realData[j].byRoute[1],
								country: tempSheetData.realData[j].byRoute[2],
								destination:
									tempSheetData.realData[j].byRoute[3],
								solution: tempSheetData.bySolution[k],
								weightBreak: tempSheetData.byWeightBreak[k],
								rate: tempSheetData.realData[j].byWeightBreak[
									k
								],
								formula: "",
								effectiveDate:
									tempSheetData.realData[j].byWeightBreak[
										tempSheetData.realData[j].byWeightBreak
											.length - 1
									],
							};

							// Store data
							standardRateRowDataArray.push(
								tempStandardRateRowData
							);

							standardRateWithFormulaRowDataArray.push(
								tempStandardRateWithFormulaRowData
							);

							// Debug
							// console.log(tempStandardRateRowData);
						}
					}
				}
			}

			// Debug
			// console.log(standardRateRowDataArray);

			// standardRateRowDataArray Checked, correct
			// standardRateWithFormulaRowDataArray Checked, formula wrong

			// Update state without returning
			return {
				...state,
				sheetRowData: standardRateRowDataArray,
				standardRateWithFormulaRowData:
					standardRateWithFormulaRowDataArray,
			};
		});
	},

	// Standard Rate (RM) - Formula
	castSheetStandardRateFormulaDataToSheetRowData: () => {
		set((state) => {
			const standardRateFormulaRowDataArray = [];

			const tempStandardRateWithFormulaRowDataArray =
				get().standardRateWithFormulaRowData;

			for (let i = 0; i < state.sheetNameArray.length; i++) {
				if (
					state.sheetNameArray[i].trim().toLowerCase() ===
					"standard rate (rm) - formula"
				) {
					const tempSheetData = state.sheetData[i];

					// Debug
					// console.log(tempStandardRateWithFormulaRowDataArray);

					for (let j = 0; j < tempSheetData.realData.length; j++) {
						for (
							let k = 0;
							k < state.sheetData[i].bySolution.length;
							k++
						) {
							// Create a new instance of the object for each iteration
							const tempStandardRateFormulaRowData = {
								cellId:
									ExcelHandler.generateCellId(k + 5) +
									(j + 3),
								rowId:
									tempSheetData.realData[j].byRoute[0] +
									"-" +
									tempSheetData.realData[j].byRoute[3] +
									"-" +
									tempSheetData.bySolution[k] +
									"-" +
									tempSheetData.byWeightBreak[k],
								origin: tempSheetData.realData[j].byRoute[0],
								region: tempSheetData.realData[j].byRoute[1],
								country: tempSheetData.realData[j].byRoute[2],
								destination:
									tempSheetData.realData[j].byRoute[3],
								solution: tempSheetData.bySolution[k],
								weightBreak: tempSheetData.byWeightBreak[k],
								formula:
									tempSheetData.realData[j].byWeightBreak[k],
								effectiveDate:
									tempSheetData.realData[j].byWeightBreak[
										tempSheetData.realData[j].byWeightBreak
											.length - 1
									],
							};

							// Debug
							// console.log(tempStandardRateFormulaRowData.formula);

							tempStandardRateWithFormulaRowDataArray.forEach(
								(tempStandardRateWithFormulaRowData) => {
									if (
										tempStandardRateWithFormulaRowData.cellId ===
											ExcelHandler.generateCellId(k + 5) +
												(j + 3) &&
										tempStandardRateWithFormulaRowData.formula ===
											""
									) {
										tempStandardRateWithFormulaRowData.formula =
											tempStandardRateFormulaRowData.formula;
									}
								}
							);

							// Store data
							standardRateFormulaRowDataArray.push(
								tempStandardRateFormulaRowData
							);

							// Debug
							// console.log(tempStandardRateFormulaRowData.formula);
						}
					}
				}
			}

			// Debug
			// console.log(tempStandardRateWithFormulaRowDataArray);

			// standardRateFormulaRowDataArray Checked, formula wrong (cutting problem)

			// Update state without returning
			return {
				...state,
				sheetFormulaRowData: standardRateFormulaRowDataArray,
				standardRateWithFormulaRowData:
					tempStandardRateWithFormulaRowDataArray,
			};
		});
	},

	// Rate Rational
	castSheetRateRationaleDataToSheetRowData: () => {
		set((state) => {
			const rateRationaleRowDataArray = [];

			for (let i = 0; i < state.sheetNameArray.length; i++) {
				if (
					state.sheetNameArray[i].trim().toLowerCase() ===
					"rate rationale"
				) {
					const tempSheetData = state.sheetData[i];

					for (let j = 0; j < tempSheetData.realData.length; j++) {
						for (
							let k = 0;
							k < state.sheetData[i].bySolution.length;
							k++
						) {
							// Create a new instance of the object for each iteration
							const tempStandardRateRowData = {
								cellId:
									ExcelHandler.generateCellId(k + 5) +
									(j + 3),
								rowId:
									tempSheetData.realData[j].byRoute[0] +
									"-" +
									tempSheetData.realData[j].byRoute[3] +
									"-" +
									tempSheetData.bySolution[k] +
									"-" +
									tempSheetData.byWeightBreak[k],
								origin: tempSheetData.realData[j].byRoute[0],
								region: tempSheetData.realData[j].byRoute[1],
								country: tempSheetData.realData[j].byRoute[2],
								destination:
									tempSheetData.realData[j].byRoute[3],
								solution: tempSheetData.bySolution[k],
								weightBreak: tempSheetData.byWeightBreak[k],
								factor: tempSheetData.realData[j].byWeightBreak[
									k
								],
								effectiveDate:
									tempSheetData.realData[j].byWeightBreak[
										tempSheetData.realData[j].byWeightBreak
											.length - 1
									],
							};

							// Store data
							rateRationaleRowDataArray.push(
								tempStandardRateRowData
							);
							// Debug
							// console.log(tempStandardRateRowData);
						}
					}
				}
			}

			// Debug
			// console.log(rateRationaleRowDataArray);

			// rateRationaleRowDataArray Checked, correct

			// Update state without returning
			return {
				...state,
				rateRationaleRowData: rateRationaleRowDataArray,
			};
		});
	},
}));

export default useUploadedCsvStore;
