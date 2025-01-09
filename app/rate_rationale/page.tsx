"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import useUploadedCsvStore from "@/store/useUploadedCsvStore";

const columns: ColumnDef<ParsedRateRationaleRowData>[] = [
	{
		accessorKey: "origin",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Origin
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("origin")}</div>,
	},
	{
		accessorKey: "region",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Region
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("region")}</div>,
	},
	{
		accessorKey: "country",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Country
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("country")}</div>,
	},
	{
		accessorKey: "destination",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Destination
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("destination")}</div>,
	},
	{
		accessorKey: "solution",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Solution
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("solution")}</div>,
	},
	{
		accessorKey: "weightBreak",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Weight Break
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("weightBreak")}</div>,
	},
	{
		accessorKey: "factor",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Factor
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("factor")}</div>,
	},
];
import { useRouter } from "next/navigation";
import { ParsedRateRationaleRowData } from "@/types/ParsedCsvData";

export default function RateRationaleTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const data = useUploadedCsvStore((state) => state.rateRationaleRowData); // Connecting to the Zustand store

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});
	const router = useRouter();

	// Navigation options and handler
	const options = [
		{ label: "Standard Rate", link: "/standard_rate" },
		{ label: "Standard Rate Formula", link: "/standard_rate_formula" },
		{
			label: "Standard Rate With Filters",
			link: "/standard_rate_with_filter",
		},
		{
			label: "OD Relationship",
			link: "/od_relationship ",
		},
	];

	const handleNavigation = (link: string) => {
		router.push(link);
	};

	return (
		<div className="w-full p-4">
			<div className="flex items-center py-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Table</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="center">
						{options.map((option) => (
							<DropdownMenuItem
								key={option.label}
								onClick={() => handleNavigation(option.link)}
							>
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="ml-auto"
						>
							Columns <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					Total of {table.getFilteredRowModel().rows.length} row(s)
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
