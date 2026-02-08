"use server";

import { auth } from "@/lib/auth/auth";
import type { RegisterInput } from "@/schemas/register.schema";
import type { ServerActionResult } from "@/types/server-action";
import { createErrorResult } from "@/types/server-action";

export async function registerAction(
	input: RegisterInput,
): Promise<ServerActionResult> {
	try {
		const result = await auth.api.signUpEmail({
			body: input,
		});

		if (!result.user) {
			return createErrorResult("Registration failed");
		}

		return {
			success: true,
			message: "Account created successfully",
		};
	} catch (error) {
		console.error("Error in registerAction:", error);

		if (error && typeof error === "object" && "message" in error) {
			return createErrorResult(error.message as string);
		}

		return createErrorResult("An error occurred during registration");
	}
}
