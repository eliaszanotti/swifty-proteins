import { initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";

export const t = initTRPC.create({
	errorFormatter({ shape, error }) {
		const baseError = {
			success: false as const,
			message: error.message ?? "An error occurred",
		};

		if (error.cause instanceof ZodError) {
			return {
				...shape,
				data: {
					...baseError,
					zodError: z.treeifyError(error.cause),
				},
			};
		}

		return {
			...shape,
			data: baseError,
		};
	},
});

