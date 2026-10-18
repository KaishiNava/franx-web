import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

const plans: Record<string, { price: number; duration: number }> = {
  A: { price: 7500, duration: 7 }, B: { price: 14000, duration: 14 },
  C: { price: 21000, duration: 30 }, D: { price: 30000, duration: 30 },
};
const methods = new Set(["gopay", "dana", "qris"]);
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  let body: { planId?: string; paymentMethod?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Data permintaan tidak valid." }, { status: 400 }); }
  const planId = String(body.planId || "").toUpperCase();
  const method = String(body.paymentMethod || "").toLowerCase();
  const plan = plans[planId];
  if (!plan || !methods.has(method)) return NextResponse.json({ error: "Paket atau metode pembayaran tidak valid." }, { status: 400 });
  const reference = `FX-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const { error } = await supabase.from("payment_requests").insert({ user_id: user.id, plan_id: planId, amount_idr: plan.price, payment_method: method, status: "pending", reference });
  if (error) {
    console.error("payment request insert failed", error.message);
    return NextResponse.json({ error: "Belum bisa membuat pesanan. Pastikan SQL pembaruan payment_requests sudah dijalankan di Supabase." }, { status: 500 });
  }
  return NextResponse.json({ reference, status: "pending", amount: plan.price }, { status: 201 });
}
