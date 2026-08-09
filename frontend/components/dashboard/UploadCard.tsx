"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

type Item={name:string;progress:number};

export default function UploadCard(){
 const inputRef=useRef<HTMLInputElement>(null);
 const [files,setFiles]=useState<Item[]>([]);
 function handle(list:FileList|null){
  if(!list)return;
  const items=[...list].map(f=>({name:f.name,progress:100}));
  setFiles(prev=>[...prev,...items]);
 }
 return(
 <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
  <div onClick={()=>inputRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handle(e.dataTransfer.files)}} className="cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/30 p-10 text-center">
   <Upload className="mx-auto h-10 w-10 text-cyan-400"/>
   <p className="mt-3 text-white">Drag & drop research files</p>
   <p className="text-sm text-gray-400">or click to browse</p>
  </div>
  <input ref={inputRef} type="file" multiple className="hidden" onChange={e=>handle(e.target.files)}/>
  <div className="mt-6 space-y-4">
   {files.map((f,i)=>(
    <div key={i}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-300"><FileText className="h-4 w-4 text-cyan-400"/>{f.name}</span>
        <span className="text-cyan-300">{f.progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-400" style={{width:`${f.progress}%`}}/></div>
    </div>
   ))}
  </div>
 </div>);
}
