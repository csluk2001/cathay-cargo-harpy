export default class ShaStandardRateHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static formStandardRateJsonData(jsonData: StandardRateRawData): any {
    const routeAndWeightbreak = jsonData.routeAndWeightbreak;
    const solutionAndEffectiveDate = jsonData.solutionAndEffectiveDate;
    const pricing = jsonData.pricing;

    const standardRateCompact: StandardRateCompact[] = [];
    const standardRateOneLine: StandardRateOneLine[] = [];

    pricing.forEach((priceSet) => {
      const id = priceSet[0];
      const effectiveDate: string = priceSet[Number(priceSet.length) - 1];
      const routeSet = routeAndWeightbreak[Number(id) - 1];
      const solutionSet = solutionAndEffectiveDate[Number(id) - 1];

      const rate: StandardRateCompact = {
        id: id,
        originRegion: priceSet[1],
        originCountry: priceSet[2],
        originAirport: priceSet[3],
        destRegion: priceSet[4],
        destCountry: priceSet[5],
        destAirport: priceSet[6],
        solutionWeightbreakPriceMap: [],
        effectiveDate: effectiveDate,
      };

      // Map prices, solutions, and weight breaks
      for (let j = 7; j < Number(priceSet.length) - 1; j++) {
        rate.solutionWeightbreakPriceMap.push({
          solution: solutionSet[j - 5] ?? "N/A",
          weightbreak: routeSet[j] ?? "N/A",
          price: parseInt(priceSet[j]),
          formula: "",
        });
      }

      // Debug use
      // console.log(rate);

      const oneLineRate: StandardRateOneLine = {
        id: priceSet[3] + "_" + priceSet[6] + "_",
        originRegion: priceSet[1],
        originCountry: priceSet[2],
        originAirport: priceSet[3],
        destRegion: priceSet[4],
        destCountry: priceSet[5],
        destAirport: priceSet[6],
        solution: "",
        weightbreak: "",
        price: 0,
        formula: "",
        effectiveDate: effectiveDate,
      };

      // Map prices, solutions, and weight breaks
      for (let i = 0; i < rate.solutionWeightbreakPriceMap.length; i++) {
        const tempSolution =
          rate.solutionWeightbreakPriceMap[i].solution ?? "N/A";
        const tempWeightbreak =
          rate.solutionWeightbreakPriceMap[i].weightbreak ?? "N/A";
        const tempPrice = rate.solutionWeightbreakPriceMap[i].price;

        oneLineRate.solution = tempSolution;
        oneLineRate.weightbreak = tempWeightbreak;
        oneLineRate.price = tempPrice;
        oneLineRate.id += tempSolution + "_" + tempWeightbreak;

        // Debug use
        // console.log(JSON.stringify(oneLineRate, null, 2));
        standardRateOneLine.push(JSON.parse(JSON.stringify(oneLineRate)));

        oneLineRate.id = priceSet[3] + "_" + priceSet[6] + "_";
        oneLineRate.solution = "";
        oneLineRate.weightbreak = "";
        oneLineRate.price = 0;
      }

      standardRateCompact.push(rate);
    });

    return {
      compactRates: standardRateCompact,
      oneLineRates: standardRateOneLine,
    };
  }
}
