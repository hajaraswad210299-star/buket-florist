import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSerif = localFont({
 variable: "--font-instrument-serif",
 src: [{path:"../public/fonts/InstrumentSerif1.ttf",weight:"400",style:"normal"},{path:"../public/fonts/InstrumentSerif0.ttf",weight:"400",style:"italic"}],
 display: "swap",
});

export const metadata: Metadata = {
  title: "Sekar Wangi — Florist & Flora",
  description:
    "Pesan bunga mudah dan cepat. Kirim karangan bunga & gift ke seluruh Indonesia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${instrumentSerif.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
