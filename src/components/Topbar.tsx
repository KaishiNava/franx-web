import Link from "next/link";
import Brand from "./Brand";
export default function Topbar() {
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
    <Link href="/"><Brand /></Link>
    <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
      <a href="/#fitur" className="hover:text-white">Fitur</a>
      <a href="/#paket" className="hover:text-white">Paket</a>
      <a href="/#cara-kerja" className="hover:text-white">Cara kerja</a>
    </nav>
    <div className="flex gap-2"><Link href="/login" className="btn-secondary text-sm">Masuk</Link><Link href="/register" className="btn-primary text-sm">Mulai</Link></div>
  </header>;
}
