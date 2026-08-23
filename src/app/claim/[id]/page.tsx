import { seedClaimIds } from "@/lib/seed-data";
import ClaimDetailClient from "./claim-detail-client";

export function generateStaticParams() {
  return seedClaimIds.map((id) => ({ id }));
}

export default function ClaimDetailPage() {
  return <ClaimDetailClient />;
}
