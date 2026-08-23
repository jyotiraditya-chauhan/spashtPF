"use client";

import Link from "next/link";
import { useLanguage, pick } from "@/lib/i18n";
import { RequireAuth } from "@/lib/auth";
import { useClaims } from "@/lib/store";
import type { ClaimStatus } from "@/lib/types";
import { statusLabels } from "@/lib/labels";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const copy = {
  en: {
    title: "Your Claims",
    subtitle: "Form 19 — full & final PF settlement",
    amount: "Claim amount",
    filed: "Filed on",
    seeWhy: "See why this was rejected →",
    view: "View details →",
  },
  hi: {
    title: "आपके दावे",
    subtitle: "फॉर्म 19 — पूर्ण एवं अंतिम PF निपटान",
    amount: "दावा राशि",
    filed: "दायर तिथि",
    seeWhy: "यह क्यों अस्वीकृत हुआ, देखें →",
    view: "विवरण देखें →",
  },
};

const badgeVariantForStatus: Record<ClaimStatus, BadgeProps["variant"]> = {
  Submitted: "neutral",
  "Under Process": "primary",
  Settled: "success",
  Rejected: "warning",
};

function formatAmount(amount: number, lang: "en" | "hi") {
  return new Intl.NumberFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string, lang: "en" | "hi") {
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function DashboardContent() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);
  const { claims, loaded } = useClaims();

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.subtitle}</p>

      <div className="mt-6 flex flex-col gap-4">
        {claims.map((claim) => (
          <Card key={claim.id}>
            <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Form 19</span>
                  <Badge variant={badgeVariantForStatus[claim.status]}>{statusLabels[lang][claim.status]}</Badge>
                </div>
                <p className="text-sm text-muted">
                  {t.amount}: <span className="font-medium text-foreground">{formatAmount(claim.amount, lang)}</span>
                </p>
                <p className="text-sm text-muted">
                  {t.filed}: <span className="font-medium text-foreground">{formatDate(claim.filedOn, lang)}</span>
                </p>
              </div>

              <Link
                href={`/claim/${claim.id}`}
                className={
                  claim.status === "Rejected"
                    ? "min-h-11 flex items-center justify-center rounded-md bg-warning px-4 text-sm font-semibold text-warning-foreground hover:bg-warning/90"
                    : "min-h-11 flex items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted-tint"
                }
              >
                {claim.status === "Rejected" ? t.seeWhy : t.view}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
