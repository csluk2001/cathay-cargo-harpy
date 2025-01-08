"use client";

import UploadDropBox from "@/components/upload/UploadDropBox";
import UploadSheetPreview from "@/components/upload/UploadSheetPreview";
import useUploadedCsvStore from "@/store/useUploadedCsvStore";
import { useEffect, useState } from "react";

export default function LoginPage() {
	const sheetNameArray = useUploadedCsvStore((state) => state.sheetNameArray);
	const [isPreview, setIsPreview] = useState(sheetNameArray.length > 0);

	useEffect(() => {
		// Debug
		// console.log(sheetNameArray.length > 0);
		setIsPreview(sheetNameArray.length > 0);
	}, [sheetNameArray.length]);

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 md:mr-5">
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full">
						<UploadDropBox />
					</div>
				</div>
			</div>
			{isPreview && (
				<div className="flex flex-col gap-4 md:ml-5">
					<div className="flex flex-1 items-center justify-center">
						<div className="w-full">
							<UploadSheetPreview />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
