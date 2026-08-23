"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Wrench,
  Send,
  ScrollText,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useLanguage, pick, type Lang } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { rejectionRules } from "@/lib/seed-data";
import { rejectionCodeLabels } from "@/lib/labels";
import { getDecodeExplanation } from "@/lib/decode";
import type { Claim, RejectionCode } from "@/lib/types";

const copy = {
  en: {
    stat: "1 in 3 EPF withdrawal claims are now rejected — most over trivial record mismatches.",
    h1: "Your EPF claim rejection, explained in plain language.",
    subhead:
      "SpashtPF reads your EPFO rejection remark, tells you exactly what's wrong, and helps you fix it — no jargon.",
    cta: "Try the demo",
    seeHow: "See how it works ↓",

    statsTitle: "Why this exists",
    statsIntro:
      "The shift from offline, human-reviewed verification to fully automated matching is the structural cause. A one-letter difference between your Aadhaar name and your bank name — something a human reviewer would once have waved through — now triggers an automatic rejection, with no explanation of what to fix.",
    stats: [
      {
        value: "13% → 34%",
        label: "EPF claim rejection rate",
        caption: "2017-18 to 2022-23, per Indian Express reporting",
      },
      {
        value: "4",
        label: "Desks a claim can get stuck at",
        caption:
          "Dealing Hand, Section Supervisor, Accounts Officer, Regional PF Commissioner — any can park a file with a vague remark",
      },
      {
        value: "7",
        label: "Real rejection categories this app decodes",
        caption: "The most common, documented reasons EPFO claims get turned down",
      },
    ],

    widgetTitle: "See a rejection decoded — right now",
    widgetSubtitle: "No login needed. Pick a real EPFO rejection reason below.",
    widgetPortalShows: "What the portal shows",
    widgetPlainLanguage: "In plain language",
    widgetLoading: "Decoding…",

    stepsTitle: "How it works",
    steps: [
      {
        title: "Decode",
        body: "See your claim's terse portal remark translated into one plain sentence you actually understand.",
      },
      {
        title: "Fix",
        body: "A one-question-at-a-time wizard walks you to the exact field that needs correcting, with a real document upload and a side-by-side check against your Aadhaar.",
      },
      {
        title: "Resubmit or escalate",
        body: "Self-fixable issues get a pre-filled resubmission. Anything else gets a ready-to-file EPFiGMS grievance instead of a blank form.",
      },
    ],

    trustTitle: "Grounded in real research, not guesswork",
    trustBody:
      "Every rejection category, portal term, and eligibility rule here comes from EPFO's own published guidance and reported citizen experiences — cross-checked, never scraped from any live government system. See exactly what's real and what's simulated.",
    trustLink: "Read the full transparency breakdown",

    closingTitle: "Ready to see your claim decoded?",
    closingBody: "Log in with the demo credentials — no real UAN or OTP required.",
  },
  hi: {
    stat: "अब हर 3 में से 1 EPF निकासी दावा अस्वीकृत हो रहा है — ज़्यादातर मामूली रिकॉर्ड बेमेल के कारण।",
    h1: "आपके EPF दावे की अस्वीकृति, सरल भाषा में समझाई गई।",
    subhead:
      "SpashtPF आपकी EPFO अस्वीकृति टिप्पणी पढ़ता है, बताता है कि वास्तव में क्या गलत है, और उसे ठीक करने में मदद करता है — बिना किसी जटिल भाषा के।",
    cta: "डेमो आज़माएँ",
    seeHow: "देखें यह कैसे काम करता है ↓",

    statsTitle: "यह ऐप क्यों बनाया गया",
    statsIntro:
      "ऑफ़लाइन, इंसानी समीक्षा से पूरी तरह स्वचालित मिलान की ओर बदलाव ही इसकी मूल वजह है। आपके आधार नाम और बैंक नाम में एक अक्षर का अंतर — जिसे पहले कोई समीक्षक नज़रअंदाज़ कर देता — अब स्वतः अस्वीकृति ट्रिगर करता है, बिना यह बताए कि ठीक क्या करना है।",
    stats: [
      {
        value: "13% → 34%",
        label: "EPF दावा अस्वीकृति दर",
        caption: "2017-18 से 2022-23 तक (इंडियन एक्सप्रेस की रिपोर्ट के अनुसार)",
      },
      {
        value: "4",
        label: "जिन डेस्क पर दावा अटक सकता है",
        caption:
          "डीलिंग हैंड, सेक्शन सुपरवाइज़र, अकाउंट्स ऑफ़िसर, क्षेत्रीय PF कमिश्नर — कोई भी बिना स्पष्ट कारण बताए फ़ाइल रोक सकता है",
      },
      {
        value: "7",
        label: "इस ऐप में डिकोड की गई असली अस्वीकृति श्रेणियाँ",
        caption: "EPFO दावे अस्वीकृत होने के सबसे आम, दस्तावेज़ीकृत कारण",
      },
    ],

    widgetTitle: "अभी देखें, एक अस्वीकृति कैसे डिकोड होती है",
    widgetSubtitle: "लॉगिन की ज़रूरत नहीं। नीचे कोई भी असली EPFO अस्वीकृति कारण चुनें।",
    widgetPortalShows: "पोर्टल क्या दिखाता है",
    widgetPlainLanguage: "सरल भाषा में",
    widgetLoading: "समझा जा रहा है…",

    stepsTitle: "यह कैसे काम करता है",
    steps: [
      {
        title: "समझें",
        body: "पोर्टल की संक्षिप्त टिप्पणी को एक सरल, समझने योग्य वाक्य में देखें।",
      },
      {
        title: "ठीक करें",
        body: "एक-एक करके सवाल पूछने वाला विज़ार्ड आपको सही फ़ील्ड तक ले जाता है — असली दस्तावेज़ अपलोड और आधार से मिलान की जांच के साथ।",
      },
      {
        title: "दोबारा जमा करें या शिकायत करें",
        body: "खुद ठीक हो सकने वाली समस्याओं का सुधरा हुआ फॉर्म तैयार मिलता है। बाकी के लिए, खाली फॉर्म की बजाय तैयार EPFiGMS शिकायत मिलती है।",
      },
    ],

    trustTitle: "अनुमान नहीं, वास्तविक शोध पर आधारित",
    trustBody:
      "यहां हर अस्वीकृति श्रेणी, पोर्टल शब्द और पात्रता नियम EPFO के अपने प्रकाशित मार्गदर्शन और नागरिकों के अनुभवों पर आधारित है — जांचा गया, किसी भी सक्रिय सरकारी सिस्टम से कभी नहीं निकाला गया। देखें कि यहां क्या असली है और क्या नकली।",
    trustLink: "पूरा पारदर्शिता विवरण पढ़ें",

    closingTitle: "अपना दावा डिकोड होते देखना चाहते हैं?",
    closingBody: "डेमो जानकारी से लॉगिन करें — किसी असली UAN या OTP की ज़रूरत नहीं।",
  },
};

const baseDemoClaim: Claim = {
  id: "demo",
  uan: "100234567890",
  claimType: "Form19",
  status: "Rejected",
  amount: 300000,
  filedOn: "2026-07-01",
  aadhaarName: "Ramesh Kumar",
  bankName: "Ramesh Kumar",
  dobUan: "1985-11-02",
  dobAadhaar: "1985-11-02",
  dateOfExit: "2026-05-01",
  employerAttested: true,
  bankKycVerified: true,
  epsServiceMonths: 60,
  employedInEpfoRecords: false,
  rejectionCode: null,
};

const demoOverrides: Partial<Record<RejectionCode, Partial<Claim>>> = {
  NAME_MISMATCH: { bankName: "Ramesh K." },
  DOB_MISMATCH: { dobUan: "1985-11-02", dobAadhaar: "1985-02-11" },
  DOE_NOT_UPDATED: { dateOfExit: null },
};

function DecodeWidget({ lang, t }: { lang: Lang; t: (typeof copy)["en"] }) {
  const [selected, setSelected] = React.useState<RejectionCode>("NAME_MISMATCH");
  const [explanation, setExplanation] = React.useState<string | null>(null);

  const rule = rejectionRules.find((r) => r.code === selected)!;
  const demoClaim: Claim = {
    ...baseDemoClaim,
    ...demoOverrides[selected],
    rejectionCode: selected,
  };

  React.useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset before an async decode fetch starts
    setExplanation(null);
    getDecodeExplanation(demoClaim, rule, lang).then((text) => {
      if (!cancelled) setExplanation(text);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- demoClaim is derived fresh each render from `selected`
  }, [selected, lang]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="flex flex-wrap gap-2">
          {rejectionRules.map((r) => (
            <button
              key={r.code}
              type="button"
              onClick={() => setSelected(r.code)}
              aria-pressed={selected === r.code}
              className={cn(
                "min-h-11 rounded-full border px-3.5 text-xs font-medium sm:text-sm",
                selected === r.code
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted-tint",
              )}
            >
              {rejectionCodeLabels[lang][r.code]}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            {t.widgetPortalShows}
          </p>
          <div className="rounded-lg border border-border bg-muted-tint px-4 py-3 font-mono text-sm text-foreground">
            {rule.rawRemarkTemplate[lang]}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t.widgetPlainLanguage}
            </p>
            <Badge variant="warning">{rejectionCodeLabels[lang][rule.code]}</Badge>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary-tint p-4">
            {explanation ? (
              <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            ) : (
              <p className="text-sm text-muted">{t.widgetLoading}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const stepIcons = [Search, Wrench, Send];

export default function LandingPage() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-primary-tint/60 to-background px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-block rounded-full bg-primary-tint px-4 py-1.5 text-sm font-medium text-primary">
            {t.stat}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{t.h1}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t.subhead}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              {t.cta}
            </Link>
            <a
              href="#how-it-works"
              className="min-h-11 flex items-center text-sm font-medium text-primary hover:underline"
            >
              {t.seeHow}
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-xl font-semibold text-foreground">{t.statsTitle}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
            {t.statsIntro}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {t.stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-5">
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2 text-center">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-xl font-semibold text-foreground">{t.widgetTitle}</h2>
          </div>
          <p className="mx-auto mb-6 max-w-md text-center text-sm text-muted">{t.widgetSubtitle}</p>
          <DecodeWidget lang={lang} t={t} />
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-semibold text-foreground">{t.stepsTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {t.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <Card key={step.title} className="transition-shadow hover:shadow-md">
                  <CardContent className="pt-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                    </div>
                    <h3 className="mb-1.5 font-semibold text-foreground">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <ShieldCheck className="h-8 w-8 text-success" aria-hidden />
          <h2 className="text-xl font-semibold text-foreground">{t.trustTitle}</h2>
          <p className="text-sm leading-relaxed text-muted">{t.trustBody}</p>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ScrollText className="h-4 w-4" aria-hidden />
            {t.trustLink}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">{t.closingTitle}</h2>
          <p className="text-sm text-muted">{t.closingBody}</p>
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            {t.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
