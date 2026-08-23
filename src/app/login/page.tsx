"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLanguage, pick } from "@/lib/i18n";
import { useAuth, DEMO_UAN, DEMO_OTP } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const copy = {
  en: {
    title: "Log in to SpashtPF",
    description: "This is a simulated login. No real UAN or OTP is transmitted anywhere.",
    uanLabel: "Enter your UAN",
    uanHelper: `Demo UAN: ${DEMO_UAN}`,
    getOtp: "Get OTP",
    otpLabel: "Enter the OTP",
    otpHelper: `Demo OTP: ${DEMO_OTP}`,
    verify: "Verify & continue",
    change: "Change UAN",
    otpError: "That OTP doesn't match. Use the demo OTP shown below.",
    uanError: "Enter a 12-digit UAN. You can use the demo UAN shown below.",
  },
  hi: {
    title: "SpashtPF में लॉग इन करें",
    description: "यह एक नकली (simulated) लॉगिन है। कोई वास्तविक UAN या OTP कहीं नहीं भेजा जाता।",
    uanLabel: "अपना UAN दर्ज करें",
    uanHelper: `डेमो UAN: ${DEMO_UAN}`,
    getOtp: "OTP प्राप्त करें",
    otpLabel: "OTP दर्ज करें",
    otpHelper: `डेमो OTP: ${DEMO_OTP}`,
    verify: "सत्यापित करें और जारी रखें",
    change: "UAN बदलें",
    otpError: "यह OTP मेल नहीं खाता। नीचे दिखाया गया डेमो OTP उपयोग करें।",
    uanError: "12 अंकों का UAN दर्ज करें। आप नीचे दिया गया डेमो UAN उपयोग कर सकते हैं।",
  },
};

export default function LoginPage() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);
  const { login } = useAuth();
  const router = useRouter();

  const [step, setStep] = React.useState<"uan" | "otp">("uan");
  const [uan, setUan] = React.useState(DEMO_UAN);
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleGetOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{12}$/.test(uan)) {
      setError(t.uanError);
      return;
    }
    setError(null);
    setStep("otp");
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError(t.otpError);
      return;
    }
    setError(null);
    login(uan);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && <Alert variant="error">{error}</Alert>}

          {step === "uan" ? (
            <form onSubmit={handleGetOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="uan">{t.uanLabel}</Label>
                <Input
                  id="uan"
                  inputMode="numeric"
                  value={uan}
                  onChange={(e) => setUan(e.target.value.trim())}
                  maxLength={12}
                />
                <p className="text-xs text-muted">{t.uanHelper}</p>
              </div>
              <Button type="submit" className="w-full">
                {t.getOtp}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otp">{t.otpLabel}</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  maxLength={6}
                />
                <p className="text-xs text-muted">{t.otpHelper}</p>
              </div>
              <Button type="submit" className="w-full">
                {t.verify}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("uan");
                  setError(null);
                }}
                className="min-h-11 text-sm text-primary underline underline-offset-2"
              >
                {t.change}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
