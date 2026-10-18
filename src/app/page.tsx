import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, SlidersHorizontal, Server, Zap, Clock3, Check } from "lucide-react";
import Topbar from "@/components/Topbar";
import Brand from "@/components/Brand";

const plans = [
  { id:"A", name:"Premium Basic", duration:"7 hari", ram:"3 GB contoh", price:"Segera hadir", desc:"Untuk mulai mencoba", features:["Dashboard bot","Status dan log dasar","Pengaturan bot dasar","Plugin sesuai paket"], featured:false },
  { id:"B", name:"Premium Full", duration:"14 hari", ram:"6 GB contoh", price:"Segera hadir", desc:"Kontrol lebih luas", features:["Semua fitur Basic","Konfigurasi lanjutan","Kontrol server","Panel konfigurasi lebih lengkap"], featured:true },
  { id:"C", name:"Enterprise", duration:"30 hari", ram:"8 GB contoh", price:"Segera hadir", desc:"Untuk pemakaian intensif", features:["Fitur paket sebelumnya","Batas resource lebih tinggi","Kontrol konfigurasi lanjutan","Prioritas pengelolaan"], featured:false },
  { id:"D", name:"Owner Unlimited", duration:"30 hari", ram:"12 GB contoh", price:"Segera hadir", desc:"Akses fitur bot paling lengkap", features:["Semua fitur yang tersedia","Kelola plugin bot","Watermark kustom","Kontrol bot tingkat lanjut"], featured:false },
];

export default function Home() {
  return <>
    <Topbar />
    <main className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <section className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_.9fr] md:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-200"><span className="h-2 w-2 rounded-full bg-emerald-400"/> FRANXX JADIBOT · BOT MANAGEMENT</div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">Bot kamu. <span className="gradient-text">Panel kamu.</span><br/>Lebih praktis.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">Kelola bot dari satu dashboard: cek status, atur konfigurasi, pantau log, dan kendalikan server tanpa harus mengutak-atik source code.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="btn-primary">Mulai sekarang <ArrowRight size={17}/></Link><a href="#paket" className="btn-secondary">Lihat paket</a></div>
          <p className="mt-4 text-xs text-slate-500">Spesifikasi RAM dan harga pada halaman ini masih contoh. Harga final ditentukan sebelum pembayaran diaktifkan.</p>
        </div>
        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-3xl"/>
          <div className="card relative overflow-hidden p-5 shadow-glow md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><Bot/></div><div><p className="font-bold">Franxx MD</p><p className="text-xs text-slate-500">Bot instance · Demo</p></div></div><span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">● Online demo</span></div>
            <div className="grid grid-cols-2 gap-3 py-5"><Stat label="CPU" value="— %" icon={<Zap size={16}/>} /><Stat label="Memory" value="— / —" icon={<Server size={16}/>} /><Stat label="Uptime" value="Belum aktif" icon={<Clock3 size={16}/>} /><Stat label="Plan" value="Premium Basic" icon={<ShieldCheck size={16}/>} /></div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="mb-3 flex items-center justify-between text-xs"><span className="text-slate-400">CONSOLE PREVIEW</span><span className="text-slate-600">DEMO</span></div><p className="font-mono text-xs leading-6 text-emerald-300">$ jadibot status</p><p className="font-mono text-xs leading-6 text-slate-400">Web panel siap dikembangkan.</p><p className="font-mono text-xs leading-6 text-slate-400">Runtime bot belum terhubung.</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full w-1/3 rounded-full bg-violet-400"/></div></div>
          </div>
        </div>
      </section>
      <section id="fitur" className="py-14"><SectionHeading eyebrow="FITUR UTAMA" title="Semua kontrol di satu tempat" subtitle="Antarmuka web dibuat dulu; runtime bot dan payment gateway akan disambungkan setelah fondasi panel beres."/><div className="mt-8 grid gap-4 md:grid-cols-3"><Feature icon={<SlidersHorizontal/>} title="Konfigurasi aman" desc="User hanya melihat pengaturan yang diizinkan paketnya, bukan source code bot."/><Feature icon={<Server/>} title="Manajemen instance" desc="Siapkan alur start, stop, restart, status, dan log melalui adapter server."/><Feature icon={<ShieldCheck/>} title="Isolasi pengguna" desc="Data akun, langganan, dan instance dirancang terpisah dengan kebijakan akses database."/></div></section>
      <section id="cara-kerja" className="py-14"><SectionHeading eyebrow="ALUR SINGKAT" title="Dari daftar sampai bot aktif" subtitle="Sistem produksi akan mengaktifkan instance setelah pembayaran diverifikasi server."/><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["01","Buat akun","Daftar dan masuk ke dashboard."],["02","Pilih paket","Pilih durasi dan fitur sesuai kebutuhan."],["03","Pembayaran","Pembayaran akan diverifikasi lewat webhook gateway."],["04","Bot disiapkan","Sistem membuat instance terisolasi dan menerapkan konfigurasi."]].map(([n,t,d])=><div key={n} className="card p-5"><p className="text-sm font-bold text-violet-300">{n}</p><h3 className="mt-4 font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{d}</p></div>)}</div></section>
      <section id="paket" className="py-14"><SectionHeading eyebrow="PILIH PAKET" title="Paket fleksibel untuk bot kamu" subtitle="Harga dan spesifikasi ini belum final. Angka RAM hanya placeholder sampai kapasitas host produksi ditentukan."/><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plans.map(p=><div key={p.id} className={`card flex flex-col p-5 ${p.featured?"border-violet-400/40 shadow-glow":""}`}><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-widest text-violet-300">PAKET {p.id}</span>{p.featured&&<span className="rounded-full bg-violet-400/15 px-2 py-1 text-[10px] text-violet-200">POPULER</span>}</div><h3 className="mt-4 text-xl font-bold">{p.name}</h3><p className="mt-1 text-sm text-slate-500">{p.desc}</p><p className="mt-5 text-2xl font-black">{p.price}</p><p className="mt-1 text-xs text-slate-500">{p.duration} · {p.ram}</p><div className="my-5 h-px bg-white/10"/><ul className="flex-1 space-y-3">{p.features.map(f=><li key={f} className="flex gap-2 text-sm text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-emerald-300"/>{f}</li>)}</ul><Link href="/register" className={`mt-6 ${p.featured?"btn-primary":"btn-secondary"}`}>Pilih paket <ArrowRight size={15}/></Link></div>)}</div></section>
      <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 py-7 text-sm text-slate-500 sm:flex-row"><Brand small/><p>© {new Date().getFullYear()} FRANXX JADIBOT · Developed by KYZX</p></footer>
    </main>
  </>;
}
function Stat({label,value,icon}:{label:string;value:string;icon:React.ReactNode}) { return <div className="rounded-xl border border-white/5 bg-white/[.025] p-3"><div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-xs">{label}</span></div><p className="mt-2 text-sm font-bold">{value}</p></div> }
function SectionHeading({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle:string}) { return <div className="max-w-2xl"><p className="text-xs font-bold tracking-[.22em] text-violet-300">{eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{title}</h2><p className="mt-3 leading-7 text-slate-400">{subtitle}</p></div> }
function Feature({icon,title,desc}:{icon:React.ReactNode;title:string;desc:string}) { return <div className="card p-6"><div className="mb-5 inline-flex rounded-xl bg-violet-500/15 p-3 text-violet-300">{icon}</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p></div> }
