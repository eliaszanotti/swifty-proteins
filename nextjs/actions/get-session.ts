"use server";

import { auth } from "@/lib/auth/auth";
import { cookies } from "next/headers";

export async function getSessionAction() {
    const session = await auth.api.getSession({
        headers: await cookies(),
    });

    return session;
}
