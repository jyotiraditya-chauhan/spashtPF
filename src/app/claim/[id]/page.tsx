"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage, pick } from "@/lib/i18n";
import { RequireAuth } from "@/lib/auth";
import { useClaims } from "@/lib/store";
import { rejectionRules } from "@/lib/seed-data";
import { rejectionCodeLabels, statusLabels } from "@/lib/labels";
import { getDecodeExplanation } from "@/lib/decode";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const copy = {
  en: {
    notFound: "We couldn't find that claim.",
    backToDashboard: "Back to your claims",
    portalShows: "What the portal shows",
    plainLanguage: "In plain language",
    loading: "Decoding your rejection remark…",
    fixNow: "Fix this now",
    notFixable: "This doesn't look fixable myself",
    settledTitle: "This claim has been settled.",
    settledBody: (amount: string) => `The full amount, ${amount}, has been transferred to your bank account on file.`,
    processingTitle: "This claim is currently being processed.",
    processingBody: "There's nothing you need to do right now — most claims at this stage clear within 20 working days.",
  },
  hi: {
    notFound: "यह दावा नहीं मिला।",
    backToDashboard: "अपने दावों पर वापस जाएँ",
    portalShows: "पोर्टल क्या दिखाता है",
    plainLanguage: "सरल भाषा में",
    loading: "आपकी अस्वीकृति टिप्पणी समझी जा रही है…",
    fixNow: "अभी ठीक करें",
    notFixable: "यह मुझसे ठीक नहीं हो पाएगा",
    settledTitle: "यह दावा निपटाया जा चुका है।",
    settledBody: (amount: string) => `पूरी राशि, ${amount}, आपके पंजीकृत बैंक खाते में भेज दी गई है।`,
    processingTitle: "यह दावा अभी प्रक्रिया में है।",
    processingBody: "अभी आपको कुछ करने की ज़रूरत नहीं — इस चरण के अधिकांश दावे 20 कार्य दिवसों में निपट जाते हैं।",
  },
};

function formatAmount(amount: number, lang: "en" | "hi") {
  return new Intl.NumberFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ClaimDetailContent() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);
  const params = useParams<{ id: string }>();
  const { getClaim, loaded } = useClaims();
  const [explanation, setExplanation] = React.useState<string | null>(null);

  const claim = loaded ? getClaim(params.id) : undefined;
  const rule = claim?.rejectionCode
    ? rejectionRules.find((r) => r.code === claim.rejectionCode)
    : undefined;

  React.useEffect(() => {
    let cancelled = false;
    if (claim && rule) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset before an async decode fetch starts
      setExplanation(null);
      getDecodeExplanation(claim, rule, lang).then((text) => {
        if (!cancelled) setExplanation(text);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [claim, rule, lang]);

  if (!loaded) return null;

  if (!claim) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Alert variant="error">{t.notFound}</Alert>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary underline">
          {t.backToDashboard}
        </Link>
      </div>
    );
  }

  if (claim.status !== "Rejected" || !rule) {
    const isSettled = claim.status === "Settled";
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Form 19</span>
          <Badge variant={isSettled ? "success" : "primary"}>{statusLabels[lang][claim.status]}</Badge>
        </div>
        <Card>
          <CardContent className="pt-5">
            <h1 className="text-xl font-semibold text-foreground">
              {isSettled ? t.settledTitle : t.processingTitle}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {isSettled ? t.settledBody(formatAmount(claim.amount, lang)) : t.processingBody}
            </p>
          </CardContent>
        </Card>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary underline">
          {t.backToDashboard}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">Form 19</span>
        <Badge variant="warning">{statusLabels[lang][claim.status]}</Badge>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{t.portalShows}</p>
        <div className="rounded-lg border border-border bg-muted-tint px-4 py-3 font-mono text-sm text-foreground">
          {rule.rawRemarkTemplate[lang]}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.plainLanguage}</p>
          <Badge variant="warning">{rejectionCodeLabels[lang][rule.code]}</Badge>
        </div>
        <Card>
          <CardContent className="pt-5">
            {explanation ? (
              <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            ) : (
              <p className="text-sm text-muted">{t.loading}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {rule.selfFixable && (
          <Link href={`/claim/${claim.id}/fix`} className="flex-1">
            <Button className="w-full">{t.fixNow}</Button>
          </Link>
        )}
        <Link href={`/claim/${claim.id}/escalate`} className="flex-1">
          <Button variant={rule.selfFixable ? "outline" : "primary"} className="w-full">
            {t.notFixable}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ClaimDetailPage() {
  return (
    <RequireAuth>
      <ClaimDetailContent />
    </RequireAuth>
  );
}
