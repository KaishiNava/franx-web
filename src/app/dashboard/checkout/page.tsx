import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

const plans = {
  A: { name: "Premium Basic", price: 7500, duration: "7 hari" },
  B: { name: "Premium Full", price: 14000, duration: "14 hari" },
  C: { name: "Enterprise", price: 21000, duration: "30 hari" },
  D: { name: "Owner Unlimited", price: 30000, duration: "30 hari" },
} as const;
export default async function Checkout({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: rawPlan } = await searchParams;
  const planId = (rawPlan || "A").toUpperCase() as keyof typeof plans;
  const plan = plans[planId];
  if (!plan) redirect("/dashboard/plans");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <div className="mx-auto max-w-3xl"><Link href="/dashboard/plans" className="text-sm text-slate-400 hover:text-white">← Kembali ke paket</Link><p className="eyebrow mt-6">CHECKOUT MANUAL</p><h1 className="page-title">Selesaikan pesanan</h1><p className="page-description">Pilih metode pembayaran. Permintaan akan berstatus menunggu sampai admin memeriksa pembayaran.</p><div className="card mt-7 p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-xs text-slate-500">PAKET {planId}</p><h2 className="mt-2 text-xl font-bold">{plan.name}</h2><p className="mt-1 text-sm text-slate-400">Durasi {plan.duration}</p></div><p className="text-2xl font-black">Rp {plan.price.toLocaleString("id-ID")}</p></div><CheckoutForm planId={planId} planName={plan.name} amount={plan.price} email={user.email || ""} /></div><p className="mt-4 text-xs leading-5 text-slate-500">Pembayaran manual: GoPay/DANA ke 083847418942 atau QRIS dari file public/qris.jpg. Pastikan file QRIS adalah QR resmi milik pengelola sebelum deploy.</p></div>;
}
