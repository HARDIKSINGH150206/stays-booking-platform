import { requestJson } from "@/lib/api/client";
import { normalizeSingleStay, normalizeStayList } from "@/lib/api/normalize";
import type { Stay } from "@/lib/types";

export async function listStays(): Promise<Stay[]> {
  const payload = await requestJson<unknown>("/stays");
  return normalizeStayList(payload);
}

export async function getStay(stayId: string): Promise<Stay | null> {
  const payload = await requestJson<unknown>(`/stays/${stayId}`);
  return normalizeSingleStay(payload);
}
