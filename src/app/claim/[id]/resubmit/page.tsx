import { seedClaimIds } from "@/lib/seed-data";
import ResubmitClient from "./resubmit-client";

export function generateStaticParams() {
  return seedClaimIds.map((id) => ({ id }));
}

export default function ResubmitPage() {
  return <ResubmitClient />;
}
