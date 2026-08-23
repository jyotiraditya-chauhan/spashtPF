"use client";

import Link from "next/link";
import { useLanguage, pick } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    stat: "1 in 3 EPF withdrawal claims are now rejected — most over trivial record mismatches.",
    h1: "Your EPF claim rejection, explained in plain language.",
    subhead:
      "SpashtPF reads your EPFO rejection remark, tells you exactly what's wrong, and helps you fix it — no jargon.",
    cta: "Try the demo",
    stepsTitle: "How it works",
    steps: [
      {
        title: "Decode",
        body: "See your claim's terse portal remark translated into one plain sentence you actually understand.",
      },
      {
        title: "Fix",
        body: "A one-question-at-a-time wizard walks you to the exact field that needs correcting.",
      },
      {
        title: "Resubmit or escalate",
        body: "Self-fixable issues get a pre-filled resubmission. Anything else gets a ready-to-file grievance instead of a blank form.",
      },
    ],
  },
  hi: {
    stat: "अब हर 3 में से 1 EPF निकासी दावा अस्वीकृत हो रहा है — ज़्यादातर मामूली रिकॉर्ड बेमेल के कारण।",
    h1: "आपके EPF दावे की अस्वीकृति, सरल भाषा में समझाई गई।",
    subhead:
      "SpashtPF आपकी EPFO अस्वीकृति टिप्पणी पढ़ता है, बताता है कि वास्तव में क्या गलत है, और उसे ठीक करने में मदद करता है — बिना किसी जटिल भाषा के।",
    cta: "डेमो आज़माएँ",
    stepsTitle: "यह कैसे काम करता है",
    steps: [
      {
        title: "समझें",
        body: "पोर्टल की संक्षिप्त टिप्पणी को एक सरल, समझने योग्य वाक्य में देखें।",
      },
      {
        title: "ठीक करें",
        body: "एक-एक करके सवाल पूछने वाला विज़ार्ड आपको सही फ़ील्ड तक ले जाता है।",
      },
      {
        title: "दोबारा जमा करें या शिकायत करें",
        body: "खुद ठीक हो सकने वाली समस्याओं का सुधरा हुआ फॉर्म तैयार मिलता है। बाकी के लिए, खाली फॉर्म की बजाय तैयार शिकायत मिलती है।",
      },
    ],
  },
};

export default function LandingPage() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-4 inline-block rounded-full bg-primary-tint px-4 py-1.5 text-sm font-medium text-primary">
          {t.stat}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{t.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{t.subhead}</p>
        <div className="mt-8">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            {t.cta}
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-foreground">{t.stepsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.steps.map((step, i) => (
            <Card key={step.title}>
              <CardContent className="pt-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className="mb-1.5 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
