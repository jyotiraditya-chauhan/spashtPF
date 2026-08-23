import type { Metadata } from "next";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/600.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/noto-sans-devanagari/devanagari-400.css";
import "@fontsource/noto-sans-devanagari/devanagari-500.css";
import "@fontsource/noto-sans-devanagari/devanagari-600.css";
import "@fontsource/noto-sans-devanagari/devanagari-700.css";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { ClaimsProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site-header";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

export const metadata: Metadata = {
  title: "SpashtPF — Your EPF claim rejection, explained",
  description:
    "SpashtPF reads your EPFO rejection remark, tells you exactly what's wrong, and helps you fix it. Independent hackathon prototype, not affiliated with EPFO.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>
          <AuthProvider>
            <ClaimsProvider>
              <DisclaimerBanner />
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </ClaimsProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
