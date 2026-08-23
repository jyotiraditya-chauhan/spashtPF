"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage, pick } from "@/lib/i18n";
import { RequireAuth } from "@/lib/auth";
import { useClaims } from "@/lib/store";
import { statusLabels } from "@/lib/labels";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const copy = {
  en: {
    title: "Your corrected claim has been resubmitted.",
    timeline: "KYC-mismatch corrections are typically cleared in 7–15 working days after resubmission.",
    backToDashboard: "Back to your claims",
    notFound: "We couldn't find that claim.",
    steps: ["Correction submitted", "Under review", "Settled"],
  },
  hi: {
    title: "आपका सुधरा हुआ दावा दोबारा जमा कर दिया गया है।",
    timeline: "KYC-बेमेल सुधार आमतौर पर दोबारा जमा करने के 7–15 कार्य दिवसों में पूरे हो जाते हैं।",
    backToDashboard: "अपने दावों पर वापस जाएँ",
    notFound: "यह दावा नहीं मिला।",
    steps: ["सुधार जमा हुआ", "समीक्षा में", "निपटाया गया"],
  },
};

function ResubmitContent() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);
  const params = useParams<{ id: string }>();
  const { getClaim, loaded } = useClaims();
  const claim = loaded ? getClaim(params.id) : undefined;

  if (!loaded) return null;

  if (!claim) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Alert variant="error">{t.notFound}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-3xl text-success">
            ✓
          </div>
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <Badge variant="primary">{statusLabels[lang][claim.status]}</Badge>
          <p className="text-sm leading-relaxed text-muted">{t.timeline}</p>

          <div className="mt-2 flex w-full items-center justify-between">
            {t.steps.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${i === 0 ? "bg-primary" : "bg-border"}`}
                  aria-hidden
                />
                <p className="mt-2 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Link href="/dashboard" className="mt-6 inline-block text-sm text-primary underline">
        {t.backToDashboard}
      </Link>
    </div>
  );
}

export default function ResubmitClient() {
  return (
    <RequireAuth>
      <ResubmitContent />
    </RequireAuth>
  );
}
