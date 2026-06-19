import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a7a5e",
};

export const metadata: Metadata = {
  title: "Tiersitti Vulkaneifel – Tiersitter finden im Landkreis Vulkaneifel",
  description:
    "Finde vertrauensvolle Tiersitter in Deiner Nähe — Daun, Gerolstein, Kelberg und die gesamte Vulkaneifel. Kostenlos für Sitter, fair für Tierhalter.",
  metadataBase: new URL("https://tiersitti.de"),
  openGraph: {
    title: "Tiersitti Vulkaneifel",
    description: "Tierbetreuung und Tierhilfe im Landkreis Vulkaneifel",
    url: "https://tiersitti.de",
    siteName: "Tiersitti",
    locale: "de_DE",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={nunito.variable}>
      <body className={`${nunito.className} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
