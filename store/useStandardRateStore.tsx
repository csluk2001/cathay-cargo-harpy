import { create } from "zustand";

interface StandardRateState {
  contractNumber: string;
  tNcCode: string;
  standardRateCompact: StandardRateCompact[];
  standardRateOneLine: StandardRateOneLine[];
  updatestandardRateCompactData: (standardRateTable: StandardRateTable) => void;
  updateStandardRateOneLineData: (
    standardRateOneLine: StandardRateOneLine[],
  ) => void;
}

export const useStandardRateStore = create<StandardRateState>((set) => ({
  contractNumber: "",
  tNcCode: "",
  standardRateCompact: [],
  standardRateOneLine: [],
  updatestandardRateCompactData: (standardRateTable) => {
    const tempContractNumber = standardRateTable.contractNumber;
    const tempTNcCode = standardRateTable.tNcCode;
    const tempStandardRatePricingSet = standardRateTable.standardRateCompactSet;
    set(() => ({
      contractNumber: tempContractNumber,
      tNcCode: tempTNcCode,
      standardRatePricing: tempStandardRatePricingSet,
    }));
  },
  updateStandardRateOneLineData: (standardRateOneLine) => {
    set(() => ({
      standardRateOneLine: standardRateOneLine,
    }));
  },
}));
