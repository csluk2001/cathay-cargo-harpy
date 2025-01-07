import { create } from "zustand";

interface UploadedExcelFile {
    excelName: string;
    status: "Ready" | "Error";
}

interface UploadedExcelState {
    excelNameSet: string[];
    status: ("Ready" | "Error")[];
    updateUploadedExcelData: (uploadInformation: UploadedExcelFile) => void;
}

export const useUploadedExcelStore = create<UploadedExcelState>((set) => ({
    excelNameSet: [],
    status: [],
    updateUploadedExcelData: (uploadInformation) => {
        set((state) => {
            // Check if the excelName already exists in the state
            if (!state.excelNameSet.includes(uploadInformation.excelName)) {
                return {
                    ...state,
                    excelNameSet: [...state.excelNameSet, uploadInformation.excelName],
                    status: [...state.status, uploadInformation.status],
                };
            }
            // If it exists, optionally handle this case, such as updating the status
            // Here we are simply returning the current state without modification
            return state;
        });
    },
}));