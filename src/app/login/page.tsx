"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Brand from "@/components/Brand";
import { Github, Mail } from "lucide-react";

export default function LoginPage() {
  const [email,setEmail] = useState(""); const [password,setPassword] = useState("");
  const [error,setError] = useState(""); const [busy,setBusy] = useState(false); const router = useRouter();
  async function login(e:React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const supabase=createClient(); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; router.push("/dashboard"); router.refresh(); }
    catch(err) { setError(err instanceof Error ? err.message : "Login gagal."); } finally { setBusy(false); }
  }
  async function oauth(provider:"google"|"github") {
    setError(""); try { const supabase=createClient(); const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:`${location.origin}/auth/callback?next=/dashboard`}}); if(error) throw error; } catch(err) { setError(err instanceof Error?err.message:"OAuth gagal."); }
  }
  return <main className="grid min-h-screen place-items-center px-5 py-12"><div className="w-full max-w-md"><Link href="/"><Brand/></Link><div className="card mt-8 p-7 md:p-9"><h1 className="text-2xl font-black">Selamat datang kembali</h1><p className="mt-2 text-sm text-slate-400">Masuk untuk mengelola panel bot kamu.</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={()=>oauth("google")} className="btn-secondary text-sm">Google</button><button onClick={()=>oauth("github")} className="btn-secondary gap-2 text-sm"><Github size={16}/> GitHub</button></div><div className="my-6 flex items-center gap-3 text-xs text-slate-600"><div className="h-px flex-1 bg-white/10"/>ATAU EMAIL<div className="h-px flex-1 bg-white/10"/></div><form onSubmit={login} className="space-y-4"><label className="block text-sm text-slate-300">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-violet-400" placeholder="nama@email.com"/></label><label className="block text-sm text-slate-300">Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-violet-400" placeholder="••••••••"/></label>{error&&<p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy?"Memproses...":"Masuk ke dashboard"}</button></form><p className="mt-5 text-center text-sm text-slate-400">Belum punya akun? <Link className="text-violet-300 hover:text-violet-200" href="/register">Daftar</Link></p></div><Link href="/" className="mt-6 block text-center text-sm text-slate-500">← Kembali ke beranda</Link></div></main>;
}
