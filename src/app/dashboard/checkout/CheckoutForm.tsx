"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Smartphone, QrCode, CheckCircle2, LoaderCircle, Copy } from "lucide-react";
const methods = [
  { id: "gopay", name: "GoPay", description: "Pembayaran manual via GoPay", icon: Wallet },
  { id: "dana", name: "DANA", description: "Pembayaran manual via DANA", icon: Smartphone },
  { id: "qris", name: "QRIS Manual", description: "Scan QRIS resmi admin", icon: QrCode },
] as const;
export default function CheckoutForm({ planId, planName, amount, email }: { planId: string; planName: string; amount: number; email: string }) {
  const [method, setMethod] = useState<string>("qris");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const router = useRouter();
  async function submit() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/payment-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, paymentMethod: method }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Permintaan pembayaran gagal dibuat.");
      setReference(data.reference);
    } catch (e) { setError(e instanceof Error ? e.message : "Terjadi kesalahan."); }
    finally { setBusy(false); }
  }
  if (reference) return <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5"><CheckCircle2 size={28} className="text-emerald-400"/><h3 className="mt-3 text-lg font-bold">Pesanan berhasil dibuat</h3><p className="mt-2 text-sm text-slate-400">Referensi: <span className="font-mono text-slate-200">{reference}</span></p><p className="mt-2 text-sm leading-6 text-slate-400">Status: menunggu pembayaran dan pemeriksaan admin. Transfer sesuai metode yang dipilih, lalu simpan kode referensi untuk konfirmasi ke admin. Paket tidak aktif sebelum pembayaran disetujui.</p><button onClick={() => router.push("/dashboard")} className="btn-primary mt-5 w-full">Kembali ke dashboard</button></div>;
  return <div className="mt-6"><p className="text-sm font-semibold">Pilih metode pembayaran</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{methods.map(({id,name,description,icon:Icon}) => <button key={id} type="button" onClick={() => setMethod(id)} className={`rounded-2xl border p-4 text-left transition ${method===id ? "border-violet-400 bg-violet-400/10" : "border-white/10 hover:border-white/25"}`}><Icon size={22} className={method===id ? "text-violet-300" : "text-slate-400"}/><p className="mt-3 font-semibold">{name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p><span className="mt-3 block text-xs">{method===id ? "✓ Dipilih" : "Pilih metode"}</span></button>)}</div><div className="mt-5 rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="font-semibold">Tujuan pembayaran resmi</p>{method === "gopay" || method === "dana" ? <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-slate-500">{method === "gopay" ? "GoPay" : "DANA"}</p><p className="mt-1 text-xl font-bold tracking-wide">083847418942</p></div><button type="button" onClick={() => navigator.clipboard?.writeText("083847418942")} className="btn-secondary text-sm"><Copy size={15}/> Salin nomor</button></div> : <div className="mt-3"><img src="/qris.jpg" alt="QRIS pembayaran FRANXX JADIBOT" className="mx-auto max-h-80 rounded-xl bg-white object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} /><p className="text-xs leading-5 text-slate-500">QRIS ditampilkan dari <code>public/qris.jpg</code>. Pastikan file QRIS resmi milik admin tersedia sebelum menerima pembayaran.</p></div>}<p className="mt-3 text-xs text-slate-500">Pastikan nama penerima sesuai sebelum transfer.</p></div><div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100/80">Pembayaran manual. Setelah membuat pesanan, kirim bukti transfer beserta referensi kepada admin. Admin akan meninjau lalu menyetujui atau menolak dengan alasan. Aktivasi otomatis hanya berjalan jika backend runtime sudah dikonfigurasi.</div>{error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}<button disabled={busy} onClick={submit} className="btn-primary mt-5 w-full">{busy ? <><LoaderCircle size={16} className="animate-spin"/> Membuat pesanan…</> : <>Buat pesanan · Rp {amount.toLocaleString("id-ID")}</>}</button><p className="mt-3 text-xs text-slate-500">Akun: {email || "Email tidak tersedia"} · Paket {planName}</p></div>;
}
