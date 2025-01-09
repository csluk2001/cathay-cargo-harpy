"use client";

import React, { useState, useMemo } from "react";
import useUploadedCsvStore from "@/store/useUploadedCsvStore";
import { Button } from "@/components/ui/button";

type FilterType = {
  weightBreak: string;
  solution: string;
  effectiveDate: string;
};

export default function ODRelationship() {
  const data = useUploadedCsvStore(
    (state) => state.standardRateWithFormulaRowData,
  );

  const [filters, setFilters] = useState<FilterType>({
    weightBreak: "",
    solution: "",
    effectiveDate: "",
  });
  const [refreshToggle, setRefreshToggle] = useState(false); // Toggle to trigger refresh

  // Function to refresh data
  const refreshData = () => {
    setRefreshToggle((prev) => !prev); // Simple toggle to trigger useEffect or useMemo
  };

  // Extract unique filter options and destinations/origins
  const { filterOptions, origins, destinations } = useMemo(() => {
    const weightBreaks = new Set<string>();
    const solutions = new Set<string>();
    const effectiveDates = new Set<string>();
    const origins = new Set<string>();
    const destinations = new Set<string>();

    data.forEach((item) => {
      weightBreaks.add(item.weightBreak);
      solutions.add(item.solution);
      effectiveDates.add(item.effectiveDate);
      origins.add(item.origin);
      destinations.add(item.destination);
    });

    return {
      filterOptions: {
        weightBreaks: Array.from(weightBreaks),
        solutions: Array.from(solutions),
        effectiveDates: Array.from(effectiveDates),
      },
      origins: Array.from(origins),
      destinations: Array.from(destinations),
    };
  }, [data, refreshToggle]); // Include refreshToggle to trigger re-evaluation when data is refreshed

  // Filter data based on selected filters
  const matrixTable = useMemo(() => {
    return origins.map((origin) => {
      return destinations.map((destination) => {
        const foundItem = data.find(
          (item) =>
            item.origin === origin &&
            item.destination === destination &&
            (filters.weightBreak
              ? item.weightBreak === filters.weightBreak
              : true) &&
            (filters.solution ? item.solution === filters.solution : true) &&
            (filters.effectiveDate
              ? item.effectiveDate === filters.effectiveDate
              : true),
        );
        return foundItem ? foundItem.rate : "";
      });
    });
  }, [filters, data, origins, destinations]);

  // Handler for changing filters
  const handleFilterChange = (filterName: keyof FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4 items-center">
        <div className="flex-grow">
          <div className="flex gap-4">
            {/* Filter selections */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight Break:
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) =>
                  handleFilterChange("weightBreak", e.target.value)
                }
                value={filters.weightBreak}
              >
                <option value="">All</option>
                {filterOptions.weightBreaks.map((breakOption) => (
                  <option key={breakOption} value={breakOption}>
                    {breakOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Solution:
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => handleFilterChange("solution", e.target.value)}
                value={filters.solution}
              >
                <option value="">All</option>
                {filterOptions.solutions.map((solutionOption) => (
                  <option key={solutionOption} value={solutionOption}>
                    {solutionOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Effective Date:
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) =>
                  handleFilterChange("effectiveDate", e.target.value)
                }
                value={filters.effectiveDate}
              >
                <option value="">All</option>
                {filterOptions.effectiveDates.map((dateOption) => (
                  <option key={dateOption} value={dateOption}>
                    {dateOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button
          onClick={refreshData}
          className="mt-1 block text-center pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white hover:bg-gray-100 text-gray-700 font-medium"
        >
          <span>Refresh Data</span>
        </Button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>{" "}
              {/* Empty top-left cell */}
              {destinations.map((destination) => (
                <th
                  key={destination}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {destination}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matrixTable.map((row, index) => (
              <tr key={origins[index]}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {origins[index]}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
