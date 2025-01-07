/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import ShaStandardRateHandler from "./ShaStandardRateHandler";
import { useStandardRateStore } from "@/store/useStandardRateStore";
import { useUploadedExcelStore } from "@/store/useUploadedExcelStore";

export default class ShaExcelHanlder {
	static readExcelData(file: File) {
		// Data storage
		let standardRateRawData: StandardRateRawData;
		let standardRateCompact: StandardRateCompact[];
		let standardRateOneLine: StandardRateOneLine[];
		const standardRateTable: StandardRateTable = {
			contractNumber: "",
			tNcCode: "",
			standardRateCompactSet: [],
		};

		const ExcelReader = new FileReader();
		ExcelReader.onload = (event: ProgressEvent<FileReader>) => {
			try {
				const arrayBuffer = event.target?.result as ArrayBuffer;
				const binaryStr = new Uint8Array(arrayBuffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					""
				);
				const workbook = XLSX.read(binaryStr, { type: "binary" });

				workbook.SheetNames.forEach((sheetName) => {
					// Sheet according to the current 'sheetName'
					const worksheet = workbook.Sheets[sheetName];
					// Casted JSON data of the current sheet
					const jsonData =
						XLSX.utils.sheet_to_json<Record<string, any>>(
							worksheet
						);
					// Ensure sheet data is not empty
					if (jsonData.length === 0) {
						console.warn(`Sheet ${sheetName} is empty`);
						return;
					}

					const updateUploadedExcelData =
						useUploadedExcelStore.getState()
							.updateUploadedExcelData;
					updateUploadedExcelData({
						excelName: sheetName.trim(),
						status: "Ready",
					});

					// Normalize sheet name for comparison
					switch (sheetName.trim().toLowerCase()) {
						case "standard rate (rm)": {
							standardRateRawData =
								this.readStandardRate(jsonData);
							const tempObject =
								ShaStandardRateHandler.formStandardRateJsonData(
									standardRateRawData
								);

							standardRateCompact = tempObject.compactRates;
							standardRateOneLine = tempObject.oneLineRates;

							// Formatted Data
							standardRateTable.contractNumber =
								standardRateRawData.contractNumber;
							standardRateTable.tNcCode =
								standardRateRawData.tNcCode;
							standardRateTable.standardRateCompactSet =
								standardRateCompact;

							// Debug use
							// console.log(standardRateTable);

							// Debug use
							console.log(standardRateOneLine);

							// Update State Management
							const updatestandardRateCompactData =
								useStandardRateStore.getState()
									.updatestandardRateCompactData;
							updatestandardRateCompactData(standardRateTable);

							const updateStandardRateOneLineData =
								useStandardRateStore.getState()
									.updateStandardRateOneLineData;
							updateStandardRateOneLineData(standardRateOneLine);

							break;
						}
						default:
							console.warn(
								`Unrecognized sheet name: ${sheetName}`
							);
					}
				});
			} catch (error) {
				console.error("Error reading the Excel file:", error);
			}
		};

		// Use readAsArrayBuffer for better compatibility with Excel files
		ExcelReader.readAsArrayBuffer(file);
	}

	static readStandardRate(
		jsonData: Record<string, any>[]
	): StandardRateRawData {
		let contractNumber: string = "";
		let tNcCode: string = "";
		const solutionAndEffectiveDate: Record<string, any>[] = [];
		const routeAndWeightbreak: Record<string, any>[] = [];
		const pricing: Record<string, any>[] = [];

		let solutionCounter = 0;
		jsonData = ShaExcelHanlder.cleanStandardRateSheet(jsonData);

		// Read each row
		for (const row of jsonData) {
			// Skip empty rows or rows without a first column
			if (!row[0]) continue;

			// skip the change summary
			if (row[0].trim().toLowerCase() === "// end") {
				break;
			}

			switch (row[0].trim().toLowerCase()) {
				case "contract#": {
					contractNumber = row[1];
					break;
				}
				case "t&c code": {
					tNcCode = row[1];
					break;
				}
				case "net": {
					solutionCounter++;
					row.unshift(solutionCounter);
					solutionAndEffectiveDate.push(row);
					break;
				}
				case "region": {
					row.unshift(solutionCounter);
					routeAndWeightbreak.push(row);
					break;
				}
				default: {
					row.unshift(solutionCounter);
					pricing.push(row);
					break;
				}
			}
		}

		return {
			portCount: solutionCounter,
			contractNumber: contractNumber,
			tNcCode: tNcCode,
			solutionAndEffectiveDate,
			routeAndWeightbreak,
			pricing,
		};
	}

	static cleanStandardRateSheet(jsonData: Record<string, any>[]): any {
		const transformedData = jsonData.map((row) => {
			const transformedRow: any[] = [];

			for (const [, value] of Object.entries(row)) {
				transformedRow.push(value);
			}

			return transformedRow;
		});
		return transformedData;
	}
}
