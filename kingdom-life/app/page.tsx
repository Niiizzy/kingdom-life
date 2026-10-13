"use client";
import { useEffect, useState } from "react";

type Lang = "EN" | "PG";
type AreaId = "surulere" | "oshodi" | "yaba" | "ikeja" | "lekki" | "ajah" | "alaba";

const translations = {
  EN: { spirit: "Spirit", souls: "Souls", money: "Money", oshodiAlert: "Oshodi is dangerous! +5 souls", save: "Auto-Saved" },
  PG: { spirit: "Spirit Level", souls: "Souls Don Win", money: "Your Money", oshodiAlert: "Oshodi no easy o! But 5 souls at once!", save: "We don save am!" }
};

const AREAS: Record<AreaId, {name: string, x: number, y: number, color: string, risk: number, reward: number, descEN: string, descPG: string}> = {
  surulere: {name: "Surulere", x: 100, y: 300, color: "#a855f7", risk: 0.2, reward: 2, descEN: "Stadium - Big crusade", descPG: "Stadium - Crowd full"},
  oshodi: {name: "Oshodi", x: 250, y: 250, color: "#ef4444", risk: 0.4, reward: 5, descEN: "MARKET - Many souls", descPG: "Oshodi Market - Souls full"},
  yaba: {name: "Yaba", x: 400, y: 250, color: "#22c55e", risk: 0.15, reward: 1, descEN: "UNILAG Students", descPG: "UNILAG Students dey"},
  ikeja: {name: "Ikeja", x: 400, y: 100, color: "#3b82f6", risk: 0.25, reward: 3, descEN: "Computer Village", descPG: "Computer Village"},
  lekki: {name: "Lekki", x: 650, y: 280, color: "#06b6d4", risk: 0.15, reward: 4, descEN: "Island - Rich", descPG: "Lekki - Big men"},
  ajah: {name: "Ajah", x: 650, y: 400, color: "#f59e0b", risk: 0.1, reward: 2, descEN: "New estates", descPG: "Ajah - New houses"},
  alaba: {name: "Alaba", x: 100, y: 100, color: "#ec4899", risk: 0.3, reward: 6, descEN: "Traders bring friends", descPG: "If you win 1, e go bring 5"},
};

const AREA_IDS: AreaId[] = ["surulere","oshodi","yaba","ikeja","lekki","ajah","alaba"];
const defaultGame = { spirit: 100, souls: 0, money: 5000, player: {x: 400, y: 250}, lang: "EN" as Lang };

export default function Game() {
  const [game, setGame] = useState(() => {
    if (typeof window === "undefined") return defaultGame;
    try {
      const save = localStorage.getItem("kingdom-life-v2");
      if (save) {
        const d = JSON.parse(save);
        return {
          spirit: d.spirit?? 100, souls: d.souls?? 0, money: d.money?? 5000,
          player: d.player?? {x: 400, y: 250}, lang: d.lang?? "EN"
        };
      }
    } catch {}
    return defaultGame;
  });

  const [currentArea, setCurrentArea] = useState<AreaId | null>(null);
  const [message, setMessage] = useState("Use WASD to walk!");
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const t = translations[game.lang];

  useEffect(() => { localStorage.setItem("kingdom-life-v2", JSON.stringify(game)); }, [game]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => setKeys(k => ({...k, [e.key.toLowerCase()]: true}));
    const up = (e: KeyboardEvent) => setKeys(k => ({...k, [e.key.toLowerCase()]: false}));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGame(g => {
        let nx = g.player.x, ny = g.player.y;
        if (keys["w"] || keys["arrowup"]) ny -= 5;
        if (keys["s"] || keys["arrowdown"]) ny += 5;
        if (keys["a"] || keys["arrowleft"]) nx -= 5;
        if (keys["d"] || keys["arrowright"]) nx += 5;
        nx = Math.max(20, Math.min(760, nx));
        ny = Math.max(20, Math.min(460, ny));
        if (nx!== g.player.x || ny!== g.player.y) {
          for (const aid of AREA_IDS) {
            const area = AREAS[aid];
            const dist = Math.hypot(nx - area.x, ny - area.y);
            if (dist < 55 && currentArea!== aid) {
              setCurrentArea(aid);
              setMessage(`${area.name}: ${g.lang==="PG"? area.descPG : area.descEN}`);
              break;
            }
          }
          return {...g, player: {x: nx, y: ny}};
        }
        return g;
      });
    }, 20);
    return () => clearInterval(id);
  }, [keys, currentArea]);

  const winSoul = () => {
    if (!currentArea) return;
    const area = AREAS[currentArea];
    if (Math.random() < area.risk) {
      setGame(g => ({...g, money: g.money - 1000, spirit: g.spirit + 10}));
      setMessage(game.lang==="PG"? "Area boy hold you! -N1000 but +10 Spirit" : "Area boy! -N1000 but +10 boldness");
    } else {
      setGame(g => ({...g, souls: g.souls + area.reward, spirit: Math.min(100, g.spirit + 5)}));
      setMessage(game.lang==="PG"? `You win ${area.reward} souls!` : `Won ${area.reward} souls!`);
    }
  };

  const boardDanfo = (target: AreaId) => {
    if (game.money < 500) { setMessage("No money for danfo!"); return; }
    setGame(g => ({...g, money: g.money - 500, player: {x: AREAS[target].x, y: AREAS[target].y}}));
  };

  return (
    <div style={{background: "#0f172a", color: "white", minHeight: "100vh", padding: 10}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1 style={{fontWeight: 900, fontSize: 18}}>KINGDOM LIFE - GTA LAGOS</h1>
        <select value={game.lang} onChange={e=>setGame(g=>({...g, lang: e.target.value as Lang}))} style={{color: "black", padding: 5, borderRadius: 5}}>
          <option value="EN">EN</option><option value="PG">PG</option>
        </select>
      </div>
      <div style={{display: "flex", gap: 8, margin: "10px 0"}}>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.spirit}: {game.spirit}</span>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.souls}: {game.souls}</span>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.money}: ₦{game.money}</span>
      </div>
      <div style={{position: "relative", background: "#fde68a", border: "4px solid #1e293b", width: "100%", maxWidth: 800, height: 500, overflow: "hidden", borderRadius: 10}}>
        <div style={{position: "absolute", top: 120, left: 0, right: 0, height: 18, background: "#334155"}}></div>
        <div style={{position: "absolute", top: 0, bottom: 0, left: 360, width: 18, background: "#334155"}}></div>
        {AREA_IDS.map(id => {
          const area = AREAS[id];
          return <div key={id} style={{position: "absolute", left: area.x - 35, top: area.y - 25, background: currentArea===id? "white" : area.color, color: currentArea===id? "black" : "white", padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, border: "2px solid black"}}>{area.name}</div>
        })}
        <div style={{position: "absolute", left: game.player.x - 12, top: game.player.y - 12, width: 24, height: 24, background: "#22c55e", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center"}}>✝️</div>
      </div>
      <p style={{margin: "10px 0", fontWeight: 700, color: "#facc15"}}>{message}</p>
      {currentArea && (
        <div style={{background: "#1e293b", padding: 15, borderRadius: 10}}>
          <h3>{AREAS[currentArea].name}</h3>
          {currentArea==="oshodi" && <p style={{color: "#ef4444", fontWeight: 800}}>{t.oshodiAlert}</p>}
          <button onClick={winSoul} style={{background: "#22c55e", color: "white", padding: "10px 20px", borderRadius: 8, fontWeight: 800, border: "none", marginRight: 10}}>WIN SOUL (+{AREAS[currentArea].reward})</button>
          <button onClick={()=>{setGame(g=>({...g, spirit: 100})); setMessage("Devotion done!")}} style={{background: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: 8, border: "none"}}>DEVOTION</button>
          <div style={{marginTop: 12, display: "flex", gap: 5, flexWrap: "wrap"}}>
            {AREA_IDS.map(id => id!==currentArea && (
              <button key={id} onClick={()=>boardDanfo(id)} style={{background: "#eab308", color: "black", padding: "6px 10px", borderRadius: 5, fontSize: 12, fontWeight: 700, border: "none"}}>{id} (-N500)</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}