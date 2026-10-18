import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const mimeToExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const { id } = await context.params;
  const form = await request.formData().catch(() => null);
  const file = form?.get("proof");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pilih gambar bukti pembayaran." }, { status: 400 });
  if (!mimeToExt[file.type]) return NextResponse.json({ error: "Format harus JPG, PNG, atau WEBP." }, { status: 400 });
  if (file.size <= 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Ukuran bukti maksimal 5 MB." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: payment, error: lookupError } = await admin.from("payment_requests").select("id,user_id,status").eq("id", id).single();
    if (lookupError || !payment || payment.user_id !== user.id) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    if (!["pending", "awaiting_review", "rejected"].includes(payment.status)) return NextResponse.json({ error: "Pesanan ini tidak menerima bukti baru." }, { status: 409 });
    const path = `${user.id}/${id}.${mimeToExt[file.type]}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage.from("payment-proofs").upload(path, bytes, { contentType: file.type, upsert: true });
    if (uploadError) throw uploadError;
    const { error: updateError } = await admin.from("payment_requests").update({ proof_url: path, status: "awaiting_review", rejection_reason: null }).eq("id", id).eq("user_id", user.id);
    if (updateError) throw updateError;
    return NextResponse.json({ ok: true, status: "awaiting_review" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengunggah bukti." }, { status: 500 });
  }
}
