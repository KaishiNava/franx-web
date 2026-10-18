import { Bot } from "lucide-react";
export default function Brand({ small = false }: { small?: boolean }) {
  return <span className="inline-flex items-center gap-2 font-bold tracking-tight">
    <span className={`brand-mark grid place-items-center rounded-xl ${small ? "h-8 w-8" : "h-10 w-10"}`}><Bot size={small ? 17 : 21}/></span>
    <span className={small ? "text-base" : "text-xl"}>FRANXX <span className="brand-word">JADIBOT</span></span>
  </span>;
}
