import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Zap, Crown, Layers3, Wallet } from "lucide-react";

const plans = [
  { id: "A", name: "Premium Basic", price: 7500, duration: "7 hari", description: "Untuk mulai menjalankan bot pribadi.", icon: Zap, features: ["Pengaturan bot dasar", "Status dan log dasar", "Pengelolaan satu instance"] },
  { id: "B", name: "Premium Full", price: 14000, duration: "14 hari", description: "Kontrol lebih luas untuk penggunaan rutin.", icon: ShieldCheck, features: ["Semua fitur Basic", "Kontrol konfigurasi lanjutan", "Pemantauan instance"] },
  { id: "C", name: "Enterprise", price: 21000, duration: "30 hari", description: "Untuk penggunaan intensif dan kebutuhan lebih besar.", icon: Layers3, features: ["Fitur paket sebelumnya", "Batas resource sesuai paket", "Prioritas pengelolaan"] },
  { id: "D", name: "Owner Unlimited", price: 30000, duration: "30 hari", description: "Akses fitur bot paling lengkap.", icon: Crown, features: ["Semua fitur yang tersedia", "Kelola plugin bot", "Watermark kustom", "Kontrol bot tingkat lanjut"] },
];

export default function Plans() {
  return <>
    <div className="max-w-3xl"><p className="eyebrow">PAKET & LANGGANAN</p><h1 className="page-title">Pilih paket yang sesuai</h1><p className="page-description">Pilih paket, lalu lanjutkan pembayaran manual melalui GoPay, DANA, atau QRIS. Aktivasi dilakukan setelah pembayaran diverifikasi admin.</p></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{plans.map((p) => { const Icon = p.icon; return <article key={p.id} className="card plan-card flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between"><span className="plan-label">PAKET {p.id}</span><span className="plan-icon"><Icon size={19}/></span></div>
      <h2 className="mt-5 text-xl font-bold tracking-tight">{p.name}</h2><p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">{p.description}</p>
      <div className="mt-5 rounded-xl border border-white/10 px-4 py-3"><p className="text-xs text-slate-500">Harga paket</p><p className="mt-1 text-2xl font-black tracking-tight">Rp {p.price.toLocaleString("id-ID")}</p><p className="mt-1 text-xs text-slate-500">Aktif selama {p.duration}</p></div>
      <div className="my-5 h-px bg-white/10"/><ul className="flex-1 space-y-3">{p.features.map(f=><li key={f} className="flex items-start gap-2.5 text-sm leading-5 text-slate-300"><Check size={17} className="mt-0.5 shrink-0 text-emerald-400"/><span>{f}</span></li>)}</ul>
      <div className="mt-7 rounded-xl bg-white/[.035] p-3.5"><p className="flex items-center gap-2 text-sm font-semibold"><Wallet size={16}/> Pembayaran manual</p><p className="mt-1 text-xs leading-5 text-slate-500">GoPay, DANA, atau QRIS. Paket aktif setelah pembayaran diverifikasi.</p></div>
      <Link href={`/dashboard/checkout?plan=${p.id}`} className="btn-primary mt-4 w-full">Pilih paket <ArrowRight size={16}/></Link>
    </article>})}</div>
    <div className="card mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Butuh bantuan menentukan paket?</h2><p className="mt-1 text-sm text-slate-500">Kamu bisa melihat ringkasan akun dan status instance dari dashboard.</p></div><Link href="/dashboard" className="btn-secondary shrink-0">Kembali ke dashboard <ArrowRight size={15}/></Link></div>
  </>;
}
