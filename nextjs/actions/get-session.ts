"use server";

import { auth } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import type { ServerActionResult } from "@/types/server-action";
import { createErrorResult } from "@/types/server-action";
import { Session } from "better-auth";

export async function getSessionAction(): Promise<ServerActionResult<Session>> {
	try {
		const cookieStore = await cookies();
		const headers = new Headers();

		const cookieString = cookieStore
			.getAll()
			.map(({ name, value }) => `${name}=${value}`)
			.join("; ");

		headers.set("cookie", cookieString);

		const result = await auth.api.getSession({
			headers,
		});

		if (!result?.user) {
			return createErrorResult("No active session");
		}

		return {
			success: true,
			data: result.session,
		};
	} catch (error) {
		console.error("Error in getSessionAction:", error);

		if (error && typeof error === "object" && "message" in error) {
			return createErrorResult(error.message as string);
		}

		return createErrorResult("Failed to get session");
	}
}
