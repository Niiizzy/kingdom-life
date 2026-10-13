"use client";
import { useEffect, useState, useRef } from "react";

type Lang = "EN" | "PG";
type AreaId = "surulere" | "oshodi" | "yaba" | "ikeja" | "lekki" | "ajah" | "alaba";

const translations = {
  EN: {
    spirit: "Spirit", souls: "Souls", money: "Money", enter: "ENTER",
    danfo: "Board Danfo (-N500)", trek: "Trek",
    oshodiAlert: "Oshodi is dangerous! Area boys around. But souls are many! +5 souls if you succeed",
    save: "Progress Auto-Saved", lang: "Language"
  },
  PG: {
    spirit: "Spirit Level", souls: "Souls Don Win", money: "Your Money", enter: "ENTER AREA",
    danfo: "Enter Danfo (-N500)", trek: "Waka Leg",
    oshodiAlert: "Omo! Oshodi no easy o! Area boys full here. But if you preach, you go win 5 souls at once!",
    save: "We don save am!", lang: "Language"
  }
};

const AREAS: Record<AreaId, {name: string, x: number, y: number, color: string, risk: number, reward: number, descEN: string, descPG: string}> = {
  surulere: {name: "Surulere", x: 100, y: 300, color: "#a855f7", risk: 0.2, reward: 2, descEN: "Stadium - Big crusade ground", descPG: "Stadium - Crowd full ground"},
  oshodi: {name: "Oshodi", x: 250, y: 250, color: "#ef4444", risk: 0.4, reward: 5, descEN: "MARKET - Dangerous but many souls", descPG: "Oshodi Market - Dangerous but souls full ground"},
  yaba: {name: "Yaba", x: 400, y: 250, color: "#22c55e", risk: 0.15, reward: 1, descEN: "UNILAG - Students", descPG: "UNILAG - Students dey"},
  ikeja: {name: "Ikeja", x: 400, y: 100, color: "#3b82f6", risk: 0.25, reward: 3, descEN: "Computer Village - Hustlers", descPG: "Computer Village - All na hustlers"},
  lekki: {name: "Lekki", x: 700, y: 300, color: "#06b6d4", risk: 0.15, reward: 4, descEN: "Island - Rich need anointing", descPG: "Lekki - Big men, need anointing"},
  ajah: {name: "Ajah", x: 700, y: 450, color: "#f59e0b", risk: 0.1, reward: 2, descEN: "New estates - Young families", descPG: "Ajah - New houses, families"},
  alaba: {name: "Alaba", x: 100, y: 100, color: "#ec4899", risk: 0.3, reward: 6, descEN: "Alaba - Traders bring friends", descPG: "Alaba - If you win 1, e go bring 5"},
};

export default function Game() {
  const [lang, setLang] = useState<Lang>("EN");
  const [player, setPlayer] = useState({x: 400, y: 250});
  const [spirit, setSpirit] = useState(100);
  const [souls, setSouls] = useState(0);
  const [money, setMoney] = useState(5000);
  const [currentArea, setCurrentArea] = useState<AreaId | null>(null);
  const [message, setMessage] = useState("");
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations[lang];

  // LOAD SAVE
  useEffect(() => {
    const save = localStorage.getItem("kingdom-life-v2");
    if (save) {
      const d = JSON.parse(save);
      setSpirit(d.spirit); setSouls(d.souls); setMoney(d.money);
      setPlayer(d.player); setLang(d.lang || "EN");
    }
  }, []);

  // AUTO SAVE
  useEffect(() => {
    localStorage.setItem("kingdom-life-v2", JSON.stringify({spirit, souls, money, player, lang}));
  }, [spirit, souls, money, player, lang]);

  // CONTROLS
  useEffect(() => {
    const down = (e: KeyboardEvent) => setKeys(k => ({...k, [e.key.toLowerCase()]: true}));
    const up = (e: KeyboardEvent) => setKeys(k => ({...k, [e.key.toLowerCase()]: false}));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // MOVEMENT LOOP - This is GTA walking
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(p => {
        let nx = p.x, ny = p.y;
        const speed = 5;
        if (keys["w"] || keys["arrowup"]) ny -= speed;
        if (keys["s"] || keys["arrowdown"]) ny += speed;
        if (keys["a"] || keys["arrowleft"]) nx -= speed;
        if (keys["d"] || keys["arrowright"]) nx += speed;
        // Boundaries
        nx = Math.max(20, Math.min(780, nx));
        ny = Math.max(20, Math.min(480, ny));
        // Check area enter
        for (const [id, area] of Object.entries(AREAS)) {
          const dist = Math.hypot(nx - area.x, ny - area.y);
          if (dist < 50) {
            if (currentArea!== id) {
              setCurrentArea(id as AreaId);
              setMessage(`${area.name}: ${lang==="PG"? area.descPG : area.descEN}`);
            }
          }
        }
        return {x: nx, y: ny};
      });
    }, 16);
    return () => clearInterval(interval);
  }, [keys, currentArea, lang]);

  const winSoul = () => {
    if (!currentArea) return;
    const area = AREAS[currentArea];
    if (Math.random() < area.risk) {
      setMoney(m => m - 1000);
      setSpirit(s => s + 10);
      setMessage(lang==="PG"? "Area boy hold you! You lose N1000 but you preach to am, +10 Spirit" : "Area boy encounter! -N1000 but +10 boldness");
    } else {
      setSouls(s => s + area.reward);
      setSpirit(s => Math.min(100, s + 5));
      setMessage(lang==="PG"? `You win ${area.reward} souls for ${area.name}!` : `Won ${area.reward} souls in ${area.name}!`);
    }
  };

  const boardDanfo = (target: AreaId) => {
    if (money < 500) { setMessage("No money for danfo!"); return; }
    setMoney(m => m - 500);
    setPlayer({x: AREAS[target].x, y: AREAS[target].y});
    setMessage(lang==="PG"? `Danfo carry you go ${target}` : `Danfo to ${target}`);
  };

  return (
    <div style={{background: "#0f172a", color: "white", minHeight: "100vh", padding: 10}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1 style={{fontWeight: 900}}>KINGDOM LIFE - GTA LAGOS</h1>
        <select value={lang} onChange={e=>setLang(e.target.value as Lang)} style={{color: "black", padding: 5, borderRadius: 5}}>
          <option value="EN">EN - English</option>
          <option value="PG">PG - Pidgin</option>
        </select>
      </div>

      <div style={{display: "flex", gap: 10, margin: "10px 0"}}>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.spirit}: {spirit}</span>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.souls}: {souls}</span>
        <span style={{background: "#1e293b", padding: "5px 10px", borderRadius: 5}}>{t.money}: ₦{money}</span>
        <span style={{fontSize: 12, opacity: 0.7}}>{t.save}</span>
      </div>

      {/* GTA MAP CANVAS */}
      <div style={{position: "relative", background: "#fde68a", border: "4px solid #1e293b", width: 800, height: 500, maxWidth: "100%", overflow: "hidden"}}>
        {/* Roads - simplified */}
        <div style={{position: "absolute", top: 120, left: 0, right: 0, height: 20, background: "#334155"}}></div>
        <div style={{position: "absolute", top: 0, bottom: 0, left: 350, width: 20, background: "#334155"}}></div>

        {/* Areas */}
        {Object.entries(AREAS).map(([id, area]) => (
          <div key={id} style={{
            position: "absolute", left: area.x - 40, top: area.y - 30,
            background: currentArea===id? "white" : area.color, color: currentArea===id? "black" : "white",
            padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800, border: "2px solid black",
            transform: currentArea===id? "scale(1.2)" : "scale(1)"
          }}>
            {area.name}
          </div>
        ))}

        {/* Player - Believer */}
        <div style={{
          position: "absolute", left: player.x - 10, top: player.y - 10,
          width: 20, height: 20, background: "#22c55e", borderRadius: "50%", border: "2px solid white",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12
        }}>✝️</div>

        {/* Danfo buses moving */}
        <div style={{position: "absolute", top: 125, left: (Date.now()/20)%800, background: "yellow", color: "black", padding: 2, borderRadius: 3, fontSize: 10}}>🚌 DANFO</div>
      </div>

      <p style={{margin: "10px 0", fontWeight: 700, color: "#facc15"}}>{message || "Use WASD to walk around Lagos! Enter areas to preach"}</p>

      {currentArea && (
        <div style={{background: "#1e293b", padding: 15, borderRadius: 10, marginTop: 10}}>
          <h3>{AREAS[currentArea].name} - {lang==="PG"? AREAS[currentArea].descPG : AREAS[currentArea].descEN}</h3>
          {currentArea==="oshodi" && <p style={{color: "#ef4444", fontWeight: 800}}>{t.oshodiAlert}</p>}
          <div style={{display: "flex", gap: 10, marginTop: 10}}>
            <button onClick={winSoul} style={{background: "#22c55e", color: "white", padding: "10px 20px", borderRadius: 8, fontWeight: 800}}>WIN SOUL (+{AREAS[currentArea].reward})</button>
            <button onClick={()=>{setSpirit(100); setMessage("Devotion done! Spirit restored")}} style={{background: "#3b82f6", padding: "10px 20px", borderRadius: 8}}>DEVOTION</button>
          </div>
          <div style={{marginTop: 10}}>
            <p>Board Danfo to:</p>
            <div style={{display: "flex", gap: 5, flexWrap: "wrap"}}>
              {Object.keys(AREAS).map(id => id!==currentArea && (
                <button key={id} onClick={()=>boardDanfo(id as AreaId)} style={{background: "#eab308", color: "black", padding: "5px 10px", borderRadius: 5, fontSize: 12}}>{id} (-N500)</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop: 20, background: "#020617", padding: 10, borderRadius: 10}}>
        <h4>How to Play - Lagos Life:</h4>
        <p>• WASD or Arrow Keys = Walk like GTA</p>
        <p>• Enter colored zones = Enter area</p>
        <p>• Oshodi = dangerous but +5 souls</p>
        <p>• Trek = free but risks. Danfo = N500 fast</p>
        <p>• Progress auto-saves! Language saved too</p>
      </div>
    </div>
  );
}