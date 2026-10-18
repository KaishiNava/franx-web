import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JADIBOT — Hosting bot dalam satu panel",
  description: "Kelola bot WhatsApp melalui dashboard yang praktis dan aman.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><div className="shell">{children}</div></body></html>;
}
