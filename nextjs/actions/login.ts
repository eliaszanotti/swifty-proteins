"use server";

import { auth } from "@/lib/auth/auth";
import type { LoginInput } from "@/schemas/login.schema";
import type { ServerActionResult } from "@/types/server-action";
import { createErrorResult } from "@/types/server-action";

export async function loginAction(
	input: LoginInput,
): Promise<ServerActionResult> {
	try {
		const result = await auth.api.signInEmail({
			body: input,
		});

		if (!result.user) {
			return createErrorResult("Login failed");
		}

		return {
			success: true,
			message: "Logged in successfully",
		};
	} catch (error) {
		console.error("Error in loginAction:", error);

		if (error && typeof error === "object" && "message" in error) {
			return createErrorResult(error.message as string);
		}

		return createErrorResult("An error occurred during login");
	}
}
