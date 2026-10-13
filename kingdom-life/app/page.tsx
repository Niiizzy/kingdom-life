"use client"
import { useState } from "react"
const LOCATIONS = ["Yaba - Church","Ikeja - Market","Lekki - Campus","Mainland - Bus Stop","Island - Hospital"]
const NPCs = [{name:"Tunde, Danfo Driver",need:"Anxious about rent",verse:"Phil 4:6"},{name:"Aisha, Student UNILAG",need:"Feels alone",verse:"Heb 13:5"},{name:"Mama Nkechi, Trader",need:"Business is down",verse:"Deut 28:8"}]
export default function KingdomLife(){
const [prayers,setPrayers]=useState(120)
const [revival,setRevival]=useState(2)
const [naira,setNaira]=useState(5000)
const [souls,setSouls]=useState(0)
const [message,setMessage]=useState("Welcome Believer! Do devotion to gain Spirit.")
const [location,setLocation]=useState(LOCATIONS[0])
return(<div className="min-h-screen bg-[#1a1207] text-amber-100 p-4 flex flex-col items-center">
<h1 className="text-2xl font-bold mt-4">Kingdom Life - Lagos</h1>
<div className="flex gap-2 mt-4 bg-amber-900/50 p-3 rounded-xl w-full max-w-md justify-between text-sm">
<div>🙏 {prayers}</div><div>🔥 {revival.toFixed(1)}%</div><div>💰 ₦{naira}</div><div>👥 {souls}</div>
</div>
<div className="mt-4 bg-black/30 p-3 rounded w-full max-w-md"><p className="text-xs">📍 {location}</p><p className="mt-2 text-amber-200 text-sm min-h-[50px]">{message}</p></div>
<div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-md">{LOCATIONS.map(loc=>(<button key={loc} onClick={()=>setLocation(loc)} className="bg-amber-800/40 p-2 rounded text-xs">{loc}</button>))}</div>
<div className="flex flex-col gap-3 mt-6 w-full max-w-md">
<button onClick={()=>{setPrayers(p=>p+20); setMessage("Devotion done! +20 Prayer Points")}} className="bg-amber-600 p-3 rounded-xl font-bold">📖 Devotion</button>
<button onClick={()=>{if(prayers<10){setMessage("Low Spirit! Do devotion"); return} const npc=NPCs[Math.floor(Math.random()*NPCs.length)]; setPrayers(p=>p-10); setSouls(s=>s+1); setRevival(r=>Math.min(100,r+1)); setNaira(n=>n+500); setMessage(`Met ${npc.name} - ${npc.need}. Shared ${npc.verse}. Soul won!`)}} className="bg-orange-700 p-3 rounded-xl font-bold">✝️ Win Soul</button>
<button onClick={()=>{setPrayers(p=>p-5); setRevival(r=>Math.min(100,r+0.5)); setMessage("You prayed for a player in Ikeja!")}} className="bg-yellow-900/60 p-3 rounded-xl">🙏 Pray for Player</button>
</div></div>)}