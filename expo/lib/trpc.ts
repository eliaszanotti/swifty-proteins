import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/../../nextjs/trpc";

export const trpc = createTRPCReact<AppRouter>();
