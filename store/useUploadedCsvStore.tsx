import {
	ParsedStandardRateData,
	ParsedStandardRateRowData,
} from "@/types/ParsedCsvData";
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
	updateUploadedSheetData: (
		uploadedSheet: UploadedSheet,
		data: ParsedStandardRateData
	) => void;
	castSheetDataToSheetRowData: () => void;
}

const useUploadedCsvStore = create<UploadedSheetState>((set, get) => ({
	sheetNameArray: [],
	status: [],
	sheetData: [],
	sheetRowData: [],
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
	castSheetDataToSheetRowData: () => {
		set((state) => {
			let standardRateRowDataArray = [];

			for (let i = 0; i < state.sheetNameArray.length; i++) {
				if (
					state.sheetNameArray[i].trim().toLowerCase() ===
					"standard rate (rm)"
				) {
					const tempSheetData = state.sheetData[i];

					for (let j = 0; j < tempSheetData.realData.length; j++) {
						for (
							let k = 0;
							k < state.sheetData[i].bySolution.length;
							k++
						) {
							// Create a new instance of the object for each iteration
							let tempStandardRateRowData = {
								id:
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
											.length - 2
									],
							};

							// Store data
							standardRateRowDataArray.push(
								tempStandardRateRowData
							);
							// Debug
							// console.log(tempStandardRateRowData);
						}
					}
				}
			}

			// Debug
			console.log(standardRateRowDataArray);

			// Update state without returning
			return {
				...state,
				sheetRowData: standardRateRowDataArray,
			};
		});
	},
}));

export default useUploadedCsvStore;
