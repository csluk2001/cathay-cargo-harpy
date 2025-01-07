import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ShaExcelHanlder from "@/utils/ShaExcelHandler";

export default function UploadDropBox() {
	const [file, setFile] = useState<File | null>(null); // State to store the dropped file
	const [fileName, setFileName] = useState<string | null>(null);

	// Handle file drop
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			// Filter out non-Excel files
			const excelFiles = acceptedFiles.filter(
				(file) =>
					file.type ===
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
					file.type === "application/vnd.ms-excel"
			);

			console.log(
				"[Upload Page] | " +
					excelFiles.length +
					" excel file(s) selected"
			);
			if (excelFiles.length > 0) {
				// Only set the first valid file
				const selectedFile = excelFiles[0];
				setFile(selectedFile); // Save the file in state for later processing
				setFileName(selectedFile.name); // Set the file name in the local state
			} else {
				alert("Only Excel files are accepted!");
			}
		},
		[] // No dependencies needed
	);

	// Handle file processing when "Upload" button is clicked
	const handleUpload = useCallback(() => {
		if (file) {
			console.log("[Upload Page] | Processing file:", file.name);
			ShaExcelHanlder.readExcelData(file); // Call the Zustand function to process the file
			alert("File uploaded successfully!");
			setFile(null); // Clear the file after processing
			setFileName(null); // Clear the file name after processing
		} else {
			alert("No file to upload!");
		}
	}, [file]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1, // Limit the number of files to 1
	});

	return (
		<div className="flex flex-col justify-center items-center h-screen bg-teal-800 text-white">
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-6 w-80 text-center ${
					isDragActive ? "bg-teal-600" : "bg-teal-700"
				}`}
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Drop the files here</p>
				) : (
					<p>Drag files here or click to select files</p>
				)}
			</div>
			{fileName && (
				<p className="mt-4 text-sm">Selected File: {fileName}</p>
			)}
			{fileName && (
				<button
					onClick={handleUpload}
					className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
				>
					Upload
				</button>
			)}
		</div>
	);
}
