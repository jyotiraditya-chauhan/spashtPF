import { seedClaimIds } from "@/lib/seed-data";
import EscalateClient from "./escalate-client";

export function generateStaticParams() {
  return seedClaimIds.map((id) => ({ id }));
}

export default function EscalatePage() {
  return <EscalateClient />;
}
