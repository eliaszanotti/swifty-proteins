import "server-only";
import { initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { authRouter } from "./routers/auth";

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

export const appRouter = t.router({
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
