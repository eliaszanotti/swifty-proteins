import { t } from "../trpc";
import { registerSchema } from "@/schemas/register.schema";
import { loginSchema } from "@/schemas/login.schema";
import { registerAction } from "@/actions/register";
import { loginAction } from "@/actions/login";
import { getSessionAction } from "@/actions/get-session";

export const authRouter = t.router({
	register: t.procedure.input(registerSchema).mutation(async ({ input }) => {
		return registerAction(input);
	}),

	login: t.procedure.input(loginSchema).mutation(async ({ input }) => {
		return loginAction(input);
	}),

	getSession: t.procedure.query(async () => {
		return getSessionAction();
	}),
});
