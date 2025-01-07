import {
	Table,
	TableBody,
	// TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUploadedExcelStore } from "@/store/useUploadedExcelStore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function UploadSheetPreview() {
	const excelNameSet = useUploadedExcelStore((state) => state.excelNameSet);
	const status = useUploadedExcelStore((state) => state.status);

	const router = useRouter();
	return (
		<>
			<Table>
				{/* <TableCaption>
				A list of uploaded Excel files and their statuses
			</TableCaption> */}
				<TableHeader>
					<TableRow>
						<TableHead className="w-[300px]">
							Excel File Name
						</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{excelNameSet.map((excelName, index) => (
						<TableRow key={excelName}>
							<TableCell className="font-medium">
								{excelName}
							</TableCell>
							<TableCell>{status[index]}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={1}>Total Files</TableCell>
						<TableCell>{excelNameSet.length}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
			<Button
				variant="outline"
				className="mt-4 bg-teal-800 text-white hover:bg-teal-700 hover:text-white"
				onClick={() => router.push("/standard_rate")}
			>
				Continue
			</Button>
		</>
	);
}
