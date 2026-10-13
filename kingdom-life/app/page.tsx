/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";

const LOCATIONS = {
  church: { name: "Church HQ", x: 400, y: 350, color: "#22c55e", type: "work", souls: 1, desc: "Sunday Service - Restore Spirit" },
  oshodi: { name: "Oshodi Market", x: 220, y: 280, color: "#ef4444", type: "evangelism", souls: 5, desc: "Hot market! Many souls but area boys" },
  yaba: { name: "Yaba Campus", x: 420, y: 220, color: "#3b82f6", type: "revival", souls: 3, desc: "UNILAG Revival - Students ready" },
  lekki: { name: "Lekki Crusade Ground", x: 620, y: 260, color: "#06b6d4", type: "crusade", souls: 8, desc: "Big crusade! Need 50 energy" },
  alaba: { name: "Alaba Soul Market", x: 120, y: 120, color: "#a855f7", type: "evangelism", souls: 6, desc: "Traders = Alaba multiplier" },
  ajah: { name: "Ajah Estate Outreach", x: 620, y: 400, color: "#f59e0b", type: "house-to-house", souls: 2, desc: "Door to door, easy souls" },
  mushin: { name: "Mushin Hostel", x: 150, y: 400, color: "#78716c", type: "home", souls: 0, desc: "Your home - Sleep to restore energy" },
};
const JOBS = [
  { id: "usher", name: "Usher", pay: 2000, energy: -20, spirit: +10 },
  { id: "choir", name: "Choir", pay: 3500, energy: -15, spirit: +15 },
  { id: "media", name: "Media Team", pay: 6000, energy: -25, spirit: +5 },
  { id: "evangelist", name: "Lead Evangelist", pay: 12000, energy: -35, spirit: +25 },
];

export default function KingdomLagosLife() {
  const [player, setPlayer] = useState({ x: 400, y: 350 });
  const [target, setTarget] = useState(null);
  const [stats, setStats] = useState({ spirit: 80, energy: 100, hunger: 70, joy: 60, anointing: 50, souls: 0, money: 5000 });
  const [near, setNear] = useState(null);
  const [log, setLog] = useState(["Welcome to Kingdom Lagos! Click anywhere to trek and win souls."]);
  const [job, setJob] = useState(JOBS[0]);
  const [day, setDay] = useState("Monday");
  const mapRef = useRef(null);

  // REAL CLICK TO MOVE LIKE LAGOS LIFE
  const handleMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const tx = e.clientX - rect.left;
    const ty = e.clientY - rect.top;
    setTarget({ x: tx, y: ty });
    addLog(`Trekking to (${Math.round(tx)}, ${Math.round(ty)})...`);
  };

  // Movement loop
  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      setPlayer(p => {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 5) {
          clearInterval(interval);
          setTarget(null);
          // check if near location
          for (let id in LOCATIONS) {
            let loc = LOCATIONS[id];
            if (Math.hypot(p.x - loc.x, p.y - loc.y) < 60) {
              setNear(id);
              addLog(`Arrived at ${loc.name}: ${loc.desc}`);
              // random roadside encounter
              if (Math.random() < 0.6) {
                setTimeout(() => triggerEncounter(id), 500);
              }
              break;
            }
          }
          return p;
        }
        return { x: p.x + dx * 0.08, y: p.y + dy * 0.08 };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [target]);

  const addLog = (msg) => setLog(l => [msg,...l].slice(0, 5));

  const triggerEncounter = (locId) => {
    const loc = LOCATIONS[locId];
    const events = [
      { text: `A girl in ${loc.name} says: "I need hope" - Share Jesus?`, win: loc.souls, spirit: 5 },
      { text: `Danfo driver shouts: "Oga, you get message?" - Preach!`, win: loc.souls + 1, spirit: 10 },
      { text: `Area boy: "Wetin you carry?" - Show love!`, win: 0, spirit: -10, money: -500 },
      { text: `Small revival broke out! People gathering!`, win: loc.souls * 2, spirit: 20 },
    ];
    const ev = events[Math.floor(Math.random() * events.length)];
    addLog(ev.text);
  };

  const winSoul = () => {
    if (!near) return addLog("Walk into a location first!");
    if (stats.energy < 10) return addLog("No energy! Go home to Mushin to sleep.");
    const loc = LOCATIONS[near];
    if (near === "alaba") {
      // Alaba multiplier from your original idea
      const won = loc.souls + Math.floor(Math.random() * 5);
      setStats(s => ({...s, souls: s.souls + won, energy: s.energy - 10, spirit: Math.min(100, s.spirit + 5), joy: Math.min(100, s.joy + 5) }));
      addLog(`Alaba multiplier! You won ${won} souls and they brought friends!`);
    } else {
      setStats(s => ({...s, souls: s.souls + loc.souls, energy: s.energy - 10, anointing: Math.min(100, s.anointing + 3) }));
      addLog(`Souls won! +${loc.souls} in ${loc.name}`);
    }
  };

  const doJob = () => {
    setStats(s => ({...s, money: s.money + job.pay, energy: Math.max(0, s.energy + job.energy), spirit: Math.min(100, s.spirit + job.spirit), hunger: Math.max(0, s.hunger - 15) }));
    addLog(`Worked as ${job.name}: +₦${job.pay}`);
  };

  const sleep = () => {
    setStats(s => ({...s, energy: 100, hunger: Math.max(0, s.hunger - 10), spirit: Math.min(100, s.spirit + 10) }));
    addLog("Slept at Mushin Hostel - Energy restored!");
    // rent check
    if (day === "Sunday") {
      setStats(s => ({...s, money: Math.max(0, s.money - 1500) }));
      addLog("Sunday! Hostel rent paid: -₦1500");
    }
  };

  return (
    <div style={{ background: "#0a0a0a", color: "white", minHeight: "100vh", fontFamily: "monospace", padding: 8 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontWeight: 900, fontSize: 20 }}>KINGDOM LIFE - LAGOS FOR JESUS ✝️</h1>
        <p style={{ color: "#aaa", fontSize: 12 }}>Click map to trek like Lagos Life. Win souls on the roadside.</p>

        {/* NEEDS BARS LIKE LAGOS LIFE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, margin: "10px 0" }}>
          <div>Spirit <div style={{ background: "#222", height: 8, borderRadius: 4 }}><div style={{ width: `${stats.spirit}%`, background: "#22c55e", height: 8 }} /></div></div>
          <div>Energy <div style={{ background: "#222", height: 8 }}><div style={{ width: `${stats.energy}%`, background: "#f59e0b", height: 8 }} /></div></div>
          <div>Hunger <div style={{ background: "#222", height: 8 }}><div style={{ width: `${stats.hunger}%`, background: "#ef4444", height: 8 }} /></div></div>
          <div>Anointing <div style={{ background: "#222", height: 8 }}><div style={{ width: `${stats.anointing}%`, background: "#a855f7", height: 8 }} /></div></div>
          <div>Joy {stats.joy}% | Souls {stats.souls} | ₦{stats.money}</div>
          <div>Day: {day} - Job: {job.name}</div>
        </div>

        {/* MAP - CLICK TO MOVE */}
        <div ref={mapRef} onClick={handleMapClick} style={{ position: "relative", width: "100%", height: 520, background: "#fde68a", borderRadius: 12, overflow: "hidden", border: "4px solid #222", cursor: "crosshair" }}>
          {/* Roads */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 260, height: 20, background: "#444" }} />
          <div style={{ position: "absolute", left: 350, top: 0, bottom: 0, width: 20, background: "#444" }} />

          {/* Danfos moving */}
          <div style={{ position: "absolute", left: `${(Date.now()/20)%800}px`, top: 263, background: "#eab308", padding: "2px 6px", borderRadius: 4, color: "black", fontSize: 10, fontWeight: 900 }}>DANFO</div>

          {/* Locations */}
          {Object.entries(LOCATIONS).map(([id, loc]) => (
            <div key={id} style={{ position: "absolute", left: loc.x - 40, top: loc.y - 20, background: near === id? "white" : loc.color, color: near === id? "black" : "white", padding: "6px 10px", borderRadius: 8, fontWeight: 900, fontSize: 11, border: "2px solid black", textAlign: "center" }}>
              {loc.name}<div style={{ fontSize: 8, fontWeight: 400 }}>+{loc.souls} souls</div>
            </div>
          ))}

          {/* Player - Real walking person */}
          <div style={{ position: "absolute", left: player.x - 14, top: player.y - 14, transition: "transform 0.1s", transform: target? "scale(1.1)" : "scale(1)", width: 28, height: 28, background: "#16a34a", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✝️</div>

          {/* Target */}
          {target && <div style={{ position: "absolute", left: target.x - 4, top: target.y - 4, width: 8, height: 8, background: "red", borderRadius: "50%", border: "2px solid white" }} />}
        </div>

        {/* Action Log - Lagos Life style */}
        <div style={{ background: "#111", borderRadius: 8, padding: 10, marginTop: 10, minHeight: 90 }}>
          {log.map((l, i) => <div key={i} style={{ fontSize: 13, opacity: 1 - i * 0.2, marginBottom: 4 }}>• {l}</div>)}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={winSoul} style={{ background: "#22c55e", padding: "14px 20px", borderRadius: 10, border: "none", fontWeight: 900, color: "white" }}>PREACH / WIN SOUL</button>
          <button onClick={doJob} style={{ background: "#3b82f6", padding: "14px 20px", borderRadius: 10, border: "none", color: "white" }}>WORK ({job.name} +₦{job.pay})</button>
          <button onClick={sleep} style={{ background: "#6b7280", padding: "14px 20px", borderRadius: 10, border: "none", color: "white" }}>SLEEP @ Mushin</button>
          <button onClick={() => setStats(s => ({...s, hunger: Math.min(100, s.hunger + 30), money: s.money - 500 }))} style={{ background: "#ef4444", padding: "14px 20px", borderRadius: 10, border: "none", color: "white" }}>BUY AMALA ₦500</button>
        </div>

        {/* Jobs selector */}
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          {JOBS.map(j => <button key={j.id} onClick={() => setJob(j)} style={{ background: job.id === j.id? "white" : "#222", color: job.id === j.id? "black" : "white", padding: "6px 10px", borderRadius: 6, border: "none", fontSize: 11 }}>{j.name}</button>)}
        </div>
      </div>
    </div>
  );
}