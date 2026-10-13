/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";

const LOCATIONS = {
  church: { name: "Church HQ", x: 400, y: 350, color: "#22c55e", souls: 1, desc: "Sunday Service" },
  oshodi: { name: "Oshodi Market", x: 220, y: 280, color: "#ef4444", souls: 5, desc: "Many souls but area boys" },
  yaba: { name: "Yaba Campus", x: 420, y: 220, color: "#3b82f6", souls: 3, desc: "UNILAG Revival" },
  lekki: { name: "Lekki Crusade", x: 620, y: 260, color: "#06b6d4", souls: 8, desc: "Big crusade!" },
  alaba: { name: "Alaba Market", x: 120, y: 120, color: "#a855f7", souls: 6, desc: "Alaba multiplier" },
  ajah: { name: "Ajah Estate", x: 620, y: 400, color: "#f59e0b", souls: 2, desc: "House to house" },
  mushin: { name: "Mushin Hostel", x: 150, y: 400, color: "#78716c", souls: 0, desc: "Your home" },
};
const JOBS = [
  { id: "usher", name: "Usher", pay: 2000 },
  { id: "choir", name: "Choir", pay: 3500 },
  { id: "media", name: "Media Team", pay: 6000 },
];

export default function Game() {
  const [player, setPlayer] = useState({ x: 400, y: 350 });
  const [target, setTarget] = useState(null);
  const [stats, setStats] = useState({ spirit: 80, energy: 100, souls: 0, money: 5000 });
  const [near, setNear] = useState(null);
  const [log, setLog] = useState(["Click map to trek like Lagos Life"]);
  const [danfoX, setDanfoX] = useState(0);
  const [job, setJob] = useState(JOBS[0]);
  const mapRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setDanfoX(x => (x + 3) % 800), 50);
    return () => clearInterval(t);
  }, []);

  const addLog = (m) => setLog(l => [m,...l].slice(0, 4));

  const onMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    setTarget({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => {
      setPlayer(p => {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 6) {
          clearInterval(id);
          setTarget(null);
          for (const k in LOCATIONS) {
            const loc = LOCATIONS[k];
            if (Math.hypot(p.x - loc.x, p.y - loc.y) < 70) {
              setNear(k);
              addLog("Arrived at " + loc.name);
              break;
            }
          }
          return p;
        }
        return { x: p.x + dx * 0.1, y: p.y + dy * 0.1 };
      });
    }, 16);
    return () => clearInterval(id);
  }, [target]);

  const winSoul = () => {
    if (!near) return addLog("Trek into a location first!");
    const loc = LOCATIONS[near];
    const won = near === "alaba"? loc.souls + Math.floor(Math.random() * 5) : loc.souls;
    setStats(s => ({...s, souls: s.souls + won, energy: s.energy - 10 }));
    addLog("Won " + won + " souls in " + loc.name + "!");
  };

  const doJob = () => {
    setStats(s => ({...s, money: s.money + job.pay, energy: Math.max(0, s.energy - 20) }));
    addLog("Worked as " + job.name + " +₦" + job.pay);
  };

  return (
    <div style={{ background: "#0a0a0a", color: "white", minHeight: "100vh", padding: 10 }}>
      <h1 style={{ fontWeight: 900 }}>KINGDOM LIFE - LAGOS FOR JESUS</h1>
      <div>Spirit {stats.spirit}% | Energy {stats.energy}% | Souls {stats.souls} | ₦{stats.money}</div>

      <div ref={mapRef} onClick={onMapClick} style={{ position: "relative", width: "100%", maxWidth: 800, height: 500, background: "#fde68a", marginTop: 10, border: "4px solid black", borderRadius: 12, cursor: "crosshair" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, height: 18, background: "#333" }} />
        <div style={{ position: "absolute", left: danfoX, top: 252, background: "#eab308", color: "black", fontSize: 10, padding: "2px 5px", borderRadius: 4, fontWeight: 900 }}>DANFO</div>
        {Object.keys(LOCATIONS).map((k) => {
          const loc = LOCATIONS[k];
          return (
            <div key={k} style={{ position: "absolute", left: loc.x - 35, top: loc.y - 18, background: near === k? "white" : loc.color, color: near === k? "black" : "white", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800, border: "2px solid black" }}>
              {loc.name}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: player.x - 12, top: player.y - 12, width: 26, height: 26, background: "#22c55e", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>✝️</div>
        {target && <div style={{ position: "absolute", left: target.x - 3, top: target.y - 3, width: 8, height: 8, background: "red", borderRadius: "50%" }} />}
      </div>

      <div style={{ marginTop: 10, color: "#facc15", fontWeight: 700 }}>{log[0]}</div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={winSoul} style={{ background: "#22c55e", color: "white", padding: "12px 18px", borderRadius: 8, border: "none", fontWeight: 900 }}>WIN SOUL</button>
        <button onClick={doJob} style={{ background: "#3b82f6", color: "white", padding: "12px 18px", borderRadius: 8, border: "none" }}>WORK ₦{job.pay}</button>
        <button onClick={() => setStats(s => ({...s, energy: 100 }))} style={{ background: "#555", color: "white", padding: "12px 18px", borderRadius: 8, border: "none" }}>SLEEP</button>
      </div>
    </div>
  );
}