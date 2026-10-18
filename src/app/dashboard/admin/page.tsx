import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/admin";
import AdminPayments from "./payments";
export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) redirect("/dashboard");
  return <><p className="eyebrow">ADMIN CONTROL</p><h1 className="page-title">Review pembayaran</h1><p className="page-description">Tinjau transaksi manual, lalu setujui atau tolak dengan alasan.</p><AdminPayments /></>;
}
