import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Akses admin ditolak." }, { status: 403 });
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("payment_requests").select("id,user_id,plan_id,amount_idr,payment_method,status,reference,proof_url,rejection_reason,created_at").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json({ requests: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengambil pesanan." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Akses admin ditolak." }, { status: 403 });
  let body: { id?: string; decision?: string; reason?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 }); }
  const id = String(body.id || "");
  const decision = String(body.decision || "");
  const reason = String(body.reason || "").trim();
  if (!id || !["approve", "reject"].includes(decision)) return NextResponse.json({ error: "Data keputusan tidak valid." }, { status: 400 });
  if (decision === "reject" && reason.length < 4) return NextResponse.json({ error: "Alasan penolakan minimal 4 karakter." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: payment, error: readError } = await admin.from("payment_requests").select("*").eq("id", id).single();
    if (readError || !payment) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    if (!["pending", "awaiting_review"].includes(payment.status)) return NextResponse.json({ error: "Pesanan ini sudah diproses." }, { status: 409 });
    if (decision === "reject") {
      const { error } = await admin.from("payment_requests").update({ status: "rejected", rejection_reason: reason, verified_by: user.id, verified_at: new Date().toISOString() }).eq("id", id).in("status", ["pending", "awaiting_review"]);
      if (error) throw error;
      return NextResponse.json({ ok: true, status: "rejected" });
    }
    const { data: plan, error: planError } = await admin.from("plans").select("duration_days").eq("id", payment.plan_id).single();
    if (planError || !plan) return NextResponse.json({ error: "Paket tidak ditemukan di database." }, { status: 500 });
    const starts = new Date();
    const expires = new Date(starts.getTime() + Number(plan.duration_days) * 86400000);
    const { data: subscription, error: subError } = await admin.from("subscriptions").insert({ user_id: payment.user_id, plan_id: payment.plan_id, status: "active", starts_at: starts.toISOString(), expires_at: expires.toISOString(), payment_provider: payment.payment_method, payment_reference: payment.reference }).select("id").single();
    if (subError) throw subError;
    const { error: updateError } = await admin.from("payment_requests").update({ status: "paid", verified_by: user.id, verified_at: starts.toISOString() }).eq("id", id).in("status", ["pending", "awaiting_review"]);
    if (updateError) {
      await admin.from("subscriptions").delete().eq("id", subscription.id);
      throw updateError;
    }
    return NextResponse.json({ ok: true, status: "paid", subscriptionId: subscription.id, note: "Langganan aktif. Provisioning runtime bot membutuhkan adapter Pterodactyl yang sudah dikonfigurasi." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memproses keputusan." }, { status: 500 });
  }
}
