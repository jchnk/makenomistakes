import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-serif-display",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Make No Mistakes — AI Hackathon · Warsaw · Sep 4–10, 2026",
  description:
    "Tygodniowy hackathon AI w Warszawie. Buduj, trenuj, wdrażaj. 4–10 września 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
