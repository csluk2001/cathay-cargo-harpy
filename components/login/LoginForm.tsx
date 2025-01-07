"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	emailOrGalaxyID: z.string().min(6, {
		message: "Email or GalaxyID must be at least 6 characters.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormLabel } from "../ui/form";
import { useLoginCredentials } from "@/store/useLoginCredentialsStore";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { login } = useLoginCredentials();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			emailOrGalaxyID: "",
			password: "",
		},
	});

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const success = await login(values.emailOrGalaxyID, values.password);
		alert(success ? "Login successful!" : "Login failed!");
		if (success) {
			router.push("/upload");
		}
	}

	return (
		<div
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Login</CardTitle>
					{/* <CardDescription className="text-sm">
						Please reach out marco_c_luk@cathaypacific.com via Teams
						for any inquiries.
					</CardDescription> */}
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<div className="grid gap-6">
								<div className="grid gap-6">
									<div className="grid gap-2">
										<FormLabel>Email</FormLabel>
										<Input
											{...form.register(
												"emailOrGalaxyID"
											)}
											type="email"
											placeholder="______@cathaypacific.com"
											required
										/>
									</div>
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label htmlFor="password">
												Password
											</Label>
											{/* <a
											href="#"
											className="ml-auto text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</a> */}
										</div>
										<Input
											{...form.register("password")}
											type="password"
											required
										/>
									</div>
									<Button
										type="submit"
										className="w-full"
									>
										Login
									</Button>
								</div>
								{/* <div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<a
									href="#"
									className="underline underline-offset-4"
								>
									Sign up
								</a>
							</div> */}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
