 "use client";

import { BarChart3, Brain, FileText, MessageSquare } from "lucide-react";

const cards = [
  {label:"Documents",value:"148",icon:FileText},
  {label:"Chats",value:"86",icon:MessageSquare},
  {label:"AI Summaries",value:"312",icon:Brain},
  {label:"Insights",value:"92%",icon:BarChart3},
];

export default function ResearchAnalytics(){
  return(
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((c)=>{
        const Icon=c.icon;
        return(
          <div key={c.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-cyan-400"/>
              <span className="text-xs text-gray-500">{c.label}</span>
            </div>
            <p className="mt-8 text-3xl font-bold text-white">{c.value}</p>
          </div>
        )
      })}
    </section>
  )
}
