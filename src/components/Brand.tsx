import { Bot } from "lucide-react";
export default function Brand({ small = false }: { small?: boolean }) {
  return <span className="inline-flex items-center gap-2 font-bold tracking-tight">
    <span className={`grid place-items-center rounded-xl bg-violet-500/15 text-violet-300 border border-violet-400/20 ${small ? "h-8 w-8" : "h-10 w-10"}`}><Bot size={small ? 17 : 21}/></span>
    <span className={small ? "text-base" : "text-xl"}>JADI<span className="gradient-text">BOT</span></span>
  </span>;
}
