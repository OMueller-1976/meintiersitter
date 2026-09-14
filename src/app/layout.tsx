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
  title: "Tiersitti – Tiersitter finden in Deiner Region",
  description:
    "Finde vertrauensvolle Tiersitter in Deiner Nähe. Kostenlos für Sitter, fair für Tierhalter.",
  metadataBase: new URL("https://tiersitti.de"),
  openGraph: {
    title: "Tiersitti",
    description: "Tierbetreuung und Tierhilfe in Deiner Region",
    url: "https://tiersitti.de",
    siteName: "Tiersitti",
    locale: "de_DE",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tiersitti",
  },
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
