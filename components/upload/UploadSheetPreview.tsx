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
import useUploadedCsvStore from "@/store/useUploadedCsvStore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function UploadSheetPreview() {
  const sheetNameArray = useUploadedCsvStore((state) => state.sheetNameArray);
  const status = useUploadedCsvStore((state) => state.status);

  const router = useRouter();
  return (
    <>
      <Table>
        {/* <TableCaption>
				A list of uploaded Excel files and their statuses
			</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Excel File Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheetNameArray.map((sheetName, index) => (
            <TableRow key={sheetName}>
              <TableCell className="font-medium">{sheetName}</TableCell>
              <TableCell>{status[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>Total Files</TableCell>
            <TableCell>{sheetNameArray.length}</TableCell>
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
