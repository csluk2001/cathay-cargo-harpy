import useUploadedCsvStore from "@/store/useUploadedCsvStore";
import { ParsedStandardRateData } from "@/types/ParsedCsvData";
import * as XLSX from "xlsx";

export default class ExcelHandler {
	static readExcelData(file: File) {
		return new Promise((resolve, reject) => {
			const ExcelReader = new FileReader();
			const sheetNameArray: string[] = [];
			const csvStringArray: string[] = [];

			ExcelReader.onload = (event: ProgressEvent<FileReader>) => {
				try {
					const arrayBuffer = event.target?.result as ArrayBuffer;
					const binaryStr = new Uint8Array(arrayBuffer).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					);
					const workbook = XLSX.read(binaryStr, { type: "binary" });

					workbook.SheetNames.forEach((sheetName) => {
						const worksheet = workbook.Sheets[sheetName];
						const csvStringData =
							XLSX.utils.sheet_to_csv(worksheet) + "\n\n";

						// Ensure the CSV data is not just empty lines
						if (csvStringData.trim().length === 0) {
							console.warn(`Sheet ${sheetName} is empty`);
							return;
						}

						// Debug
						// console.log(sheetName);
						// console.log(csvStringData);

						// Store the name and CSV data of each non-empty sheet
						sheetNameArray.push(sheetName);
						csvStringArray.push(csvStringData);

						switch (sheetName.trim().toLowerCase()) {
							case "standard rate (rm)": {
								const standardRatePvg =
									ExcelHandler.parseCsvData(csvStringData);
								useUploadedCsvStore
									.getState()
									.updateUploadedSheetData(
										{
											sheetName: sheetName.trim(),
											status: "Ready",
										},
										standardRatePvg
									);
								break;
							}
							case "standard rate (rm) - formula": {
								const standardRateFormula =
									ExcelHandler.parseCsvData(csvStringData);
								useUploadedCsvStore
									.getState()
									.updateUploadedSheetData(
										{
											sheetName: sheetName.trim(),
											status: "Ready",
										},
										standardRateFormula
									);
								break;
							}
							case "rate rationale": {
								const rateRationale =
									ExcelHandler.parseCsvData(csvStringData);
								useUploadedCsvStore
									.getState()
									.updateUploadedSheetData(
										{
											sheetName: sheetName.trim(),
											status: "Ready",
										},
										rateRationale
									);
								break;
							}
							default:
								break;
						}
					});

					useUploadedCsvStore
						.getState()
						.castSheetDataToSheetRowData();

					// Resolve the promise with the collected data
					resolve({ sheetNameArray, csvStringArray });
				} catch (error) {
					console.error("Error reading the Excel file:", error);
					reject(error);
				}
			};

			ExcelReader.onerror = (error) => {
				console.error("Error reading the file:", error);
				reject(error);
			};

			// Start reading the file as an ArrayBuffer for better handling of binary data
			ExcelReader.readAsArrayBuffer(file);
		});
	}

	static parseCsvData(csvData: string): ParsedStandardRateData {
		const lines = csvData.split("\n");
		const parsedData: ParsedStandardRateData = {
			contractNumber: "",
			tAndCCode: "",
			bySolution: [],
			byRoute: [],
			byWeightBreak: [],
			realData: [],
		};

		for (let i = 0; i < lines.length; i++) {
			const cells = lines[i].split(",");

			if (cells[0] === "Contract#") {
				parsedData.contractNumber = cells[1];
			} else if (cells[0] === "T&C code") {
				parsedData.tAndCCode = cells[1];
			} else if (cells[0] === "NET") {
				parsedData.bySolution = cells.filter(
					(cell) => cell !== "" && cell !== "NET"
				);
			} else if (cells[0] === "Origin") {
				parsedData.byRoute = cells.slice(0, 4);
				parsedData.byWeightBreak = cells.slice(4);
			} else if (
				!["Contract#", "T&C code", "NET", "Origin"].includes(
					cells[0]
				) &&
				cells[0] !== ""
			) {
				// Assuming that the real data starts immediately after the headers
				const byRouteRowData = cells.slice(0, 4);
				const byWeightBreakRowData = cells.slice(4);
				parsedData.realData.push({
					byRoute: byRouteRowData,
					byWeightBreak: byWeightBreakRowData,
				});
			}
		}

		// Debug
		// console.log(parsedData);

		return parsedData;
	}
}
