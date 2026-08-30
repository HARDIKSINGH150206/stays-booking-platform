import { requestJson } from "@/lib/api/client";
import { extractSession } from "@/lib/api/normalize";
import type { AuthSession } from "@/lib/types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const payload = await requestJson<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return extractSession(payload);
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  const payload = await requestJson<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return extractSession(payload);
}
