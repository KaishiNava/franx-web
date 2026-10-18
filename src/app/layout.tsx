import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRANXX JADIBOT — Bot Management",
  description: "FRANXX JADIBOT oleh KYZX — kelola bot melalui dashboard yang sederhana dan aman.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><div className="shell">{children}</div></body></html>;
}
