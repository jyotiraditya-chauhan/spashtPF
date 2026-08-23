import { seedClaimIds } from "@/lib/seed-data";
import FixWizardClient from "./fix-wizard-client";

export function generateStaticParams() {
  return seedClaimIds.map((id) => ({ id }));
}

export default function FixWizardPage() {
  return <FixWizardClient />;
}
