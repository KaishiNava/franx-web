import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Brand from "@/components/Brand";
import { LayoutDashboard, Server, CreditCard, Settings, LogOut } from "lucide-react";

export default async function DashboardLayout({children}:{children:React.ReactNode}) {
  let user = null;
  try { const supabase=await createClient(); const {data}=await supabase.auth.getUser(); user=data.user; } catch {}
  if(!user) redirect("/login");
  async function logout() { "use server"; const supabase=await createClient(); await supabase.auth.signOut(); redirect("/login"); }
  const nav=[["/dashboard","Overview",LayoutDashboard],["/dashboard/servers","Server bot",Server],["/dashboard/plans","Paket & langganan",CreditCard],["/dashboard/settings","Pengaturan",Settings]] as const;
  return <div className="min-h-screen md:flex"><aside className="border-b border-white/10 bg-[#0b0c16]/80 p-5 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r"><Link href="/"><Brand/></Link><p className="mt-8 text-[10px] font-bold tracking-[.2em] text-slate-600">WORKSPACE</p><nav className="mt-3 flex gap-2 overflow-x-auto md:flex-col">{nav.map(([href,label,Icon])=><Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><Icon size={17}/>{label}</Link>)}</nav><div className="mt-auto hidden rounded-xl border border-white/10 p-3 md:block"><p className="truncate text-sm font-semibold">{user.user_metadata?.display_name || user.email}</p><p className="mt-1 truncate text-xs text-slate-500">{user.email}</p><form action={logout}><button className="mt-3 flex items-center gap-2 text-xs text-slate-400 hover:text-white"><LogOut size={14}/> Keluar</button></form></div></aside><div className="min-w-0 flex-1 md:ml-64"><header className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-8"><div><p className="text-sm font-bold">JADIBOT Panel</p><p className="mt-1 text-xs text-slate-500">Workspace akun kamu</p></div><form action={logout} className="md:hidden"><button className="btn-secondary text-xs">Keluar</button></form></header><main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main></div></div>;
}
