"use client";

import { useLanguage, pick } from "@/lib/i18n";

const copy = {
  en: "Independent hackathon prototype. Not affiliated with EPFO or the Government of India. All data shown is synthetic.",
  hi: "यह एक स्वतंत्र हैकाथॉन प्रोटोटाइप है। EPFO या भारत सरकार से इसका कोई संबंध नहीं है। यहाँ दिखाया गया सारा डेटा काल्पनिक है।",
};

export function DisclaimerBanner() {
  const { lang } = useLanguage();
  return (
    <div className="w-full bg-warning-tint px-4 py-2 text-center text-xs font-medium text-warning sm:text-sm">
      {pick(lang, copy)}
    </div>
  );
}
