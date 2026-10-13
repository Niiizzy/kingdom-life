/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

const PLACES = [
  { id: "cchub", name: "CcHub", x: 30, y: 20, type: "work", soul: 2 },
  { id: "yaba", name: "Yaba Campus", x: 45, y: 35, type: "revival", soul: 3 },
  { id: "oshodi", name: "Oshodi Market", x: 25, y: 50, type: "evangelism", soul: 5 },
  { id: "church", name: "Church HQ", x: 50, y: 55, type: "church", soul: 1 },
  { id: "balo", name: "Balogun Market", x: 20, y: 65, type: "evangelism", soul: 6 },
  { id: "alaba", name: "Alaba Int'l", x: 10, y: 30, type: "multiplier", soul: 6 },
  { id: "lekki", name: "Lekki Crusade Ground", x: 75, y: 60, type: "crusade", soul: 8 },
  { id: "ajah", name: "Ajah Outreach", x: 80, y: 80, type: "house", soul: 2 },
  { id: "quinox", name: "Elegushi Beach Revival", x: 70, y: 40, type: "revival", soul: 4 },
  { id: "mushin", name: "Mushin Hostel", x: 35, y: 75, type: "home", soul: 0 },
];

const TRANSPORTS = [
  { id: "trek", name: "Trek (Evangelism Walk)", cost: 0, time: "5m", energy: -15, icon: "🚶" },
  { id: "danfo", name: "Danfo", cost: 500, time: "2m", energy: -5, icon: "🚌" },
  { id: "keke", name: "Keke", cost: 800, time: "1m", energy: -3, icon: "🛺" },
  { id: "okada", name: "Okada", cost: 1200, time: "30s", energy: -8, icon: "🏍️" },
];

const JOBS = [
  { name: "Usher", pay: 2500, req: "Spirit 50" },
  { name: "Choir / Worship", pay: 4000, req: "Joy 60" },
  { name: "Media & Tech", pay: 7000, req: "Anointing 40" },
  { name: "Evangelism Lead", pay: 15000, req: "Souls 50" },
];

export default function LagosLifeCloneKingdom() {
  const [money, setMoney] = useState(5000);
  const [energy, setEnergy] = useState(100);
  const [spirit, setSpirit] = useState(80);
  const [souls, setSouls] = useState(0);
  const [hunger, setHunger] = useState(70);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentPlace, setCurrentPlace] = useState("mushin");
  const [showPhone, setShowPhone] = useState(false);
  const [phoneTab, setPhoneTab] = useState("jobs");
  const [log, setLog] = useState("You woke up in Mushin Hostel. Tap any pin on map to go win souls.");
  const [danfoPos, setDanfoPos] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setDanfoPos(p => (p + 1) % 100), 100);
    return () => clearInterval(i);
  }, []);

  const travel = (transport) => {
    if (money < transport.cost) { setLog("No money for " + transport.name + "! Trek instead."); return; }
    if (energy < 10) { setLog("No energy! Sleep at Hostel."); return; }
    setMoney(m => m - transport.cost);
    setEnergy(e => Math.max(0, e + transport.energy));
    setCurrentPlace(selectedPlace.id);
    setLog(`Traveled by ${transport.name} to ${selectedPlace.name}. ${transport.time} journey.`);
    setSelectedPlace(null);

    // Roadside encounter - Kingdom version
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const won = selectedPlace.id === "alaba" ? selectedPlace.soul + Math.floor(Math.random()*5) : selectedPlace.soul;
        setSouls(s => s + won);
        setLog(`Roadside: Someone gave life to Christ in ${selectedPlace.name}! +${won} souls (Alaba multiplier active!)`);
      }, 800);
    }
  };

  const work = (job) => {
    setMoney(m => m + job.pay);
    setEnergy(e => Math.max(0, e - 20));
    setHunger(h => Math.max(0, h - 15));
    setLog(`Worked as ${job.name}: +₦${job.pay}. Energy -20`);
    setShowPhone(false);
  };

  return (
    <div style={{ background: "#f2efe7", color: "#111", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR LIKE LAGOS LIFE */}
      <div style={{ background: "white", borderBottom: "2px solid #111", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 14 }}>KINGDOM LIFE ✝️</div>
        <div style={{ display: "flex", gap: 8, fontSize: 11, fontWeight: 700 }}>
          <span>₦{money}</span>
          <span style={{ background: spirit < 30 ? "#ef4444" : "#22c55e", color: "white", padding: "2px 6px", borderRadius: 6 }}>Spirit {spirit}%</span>
          <span style={{ background: energy < 30 ? "#ef4444" : "#f59e0b", color: "white", padding: "2px 6px", borderRadius: 6 }}>Energy {energy}%</span>
          <span>Souls {souls}</span>
        </div>
      </div>

      {/* MAP AREA - DRAGGABLE LIKE LAGOS LIFE */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#e8dcc6", height: "70vh" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#00011 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Roads */}
        <div style={{ position: "absolute", left: `${danfoPos}%`, top: "50%", width: 50, height: 14, background: "#eab308", border: "2px solid black", borderRadius: 4, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>DANFO</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 18, background: "#222" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 18, background: "#222" }} />

        {PLACES.map(p => (
          <button key={p.id} onClick={() => setSelectedPlace(p)} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", background: currentPlace === p.id ? "white" : "#111", color: currentPlace === p.id ? "black" : "white", border: currentPlace === p.id ? "3px solid #22c55e" : "2px solid white", borderRadius: 12, padding: "6px 10px", fontSize: 11, fontWeight: 800, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", cursor: "pointer" }}>
            {p.name}
            <div style={{ fontSize: 8, fontWeight: 400, opacity: 0.8 }}>{p.type} • +{p.soul} souls</div>
            {currentPlace === p.id && <div style={{ fontSize: 8, background: "#22c55e", color: "white", borderRadius: 4, marginTop: 2 }}>YOU ARE HERE</div>}
          </button>
        ))}
      </div>

      {/* LOG */}
      <div style={{ background: "white", borderTop: "2px solid #111", padding: "8px 12px", fontSize: 12, minHeight: 42, fontWeight: 600 }}>{log}</div>

      {/* TRANSPORT MODAL - EXACT LAGOS LIFE FLOW */}
      {selectedPlace && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", width: "100%", maxWidth: 500, borderRadius: "18px 18px 0 0", padding: 16, borderTop: "3px solid black" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>{selectedPlace.name}</h3>
              <button onClick={() => setSelectedPlace(null)} style={{ background: "#eee", border: "none", borderRadius: 20, padding: "4px 10px" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: "#555" }}>{selectedPlace.type} - Win {selectedPlace.soul} souls. {selectedPlace.id === "alaba" ? "Alaba Multiplier: win 1 soul, bring 5 friends!" : ""}</p>
            <div style={{ fontWeight: 800, fontSize: 12, marginTop: 10, marginBottom: 6 }}>Choose Transport - Like Lagos Life:</div>
            {TRANSPORTS.map(t => (
              <button key={t.id} onClick={() => travel(t)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "2px solid #111", borderRadius: 12, marginBottom: 8, background: "white", fontWeight: 700 }}>
                <span>{t.icon} {t.name}</span><span>₦{t.cost} • {t.time}</span>
              </button>
            ))}
            <button onClick={() => { setCurrentPlace(selectedPlace.id); setSelectedPlace(null); setLog("Quick trek to " + selectedPlace.name); }} style={{ width: "100%", background: "#22c55e", color: "white", border: "none", borderRadius: 12, padding: 14, fontWeight: 900, marginTop: 6 }}>PREACH NOW (Win Soul)</button>
          </div>
        </div>
      )}

      {/* PHONE MENU - LAGOS LIFE PHONE */}
      {showPhone && (
        <div style={{ position: "fixed", inset: 0, background: "#111", zIndex: 60, padding: 16, color: "white", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 900 }}>Phone 📱</h2><button onClick={() => setShowPhone(false)} style={{ background: "white", color: "black", border: "none", borderRadius: 20, padding: "6px 14px", fontWeight: 900 }}>Close</button>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
            {["jobs", "house", "bank"].map(tab => <button key={tab} onClick={() => setPhoneTab(tab)} style={{ background: phoneTab === tab ? "white" : "#333", color: phoneTab === tab ? "black" : "white", border: "none", padding: "8px 14px", borderRadius: 20, fontWeight: 800, textTransform: "capitalize" }}>{tab}</button>)}
          </div>
          {phoneTab === "jobs" && <div>{JOBS.map(j => <div key={j.name} style={{ background: "#222", padding: 12, borderRadius: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 800 }}>{j.name}</div><div style={{ fontSize: 11, color: "#aaa" }}>{j.req}</div></div><button onClick={() => work(j)} style={{ background: "#22c55e", border: "none", padding: "8px 12px", borderRadius: 8, fontWeight: 900 }}>Work ₦{j.pay}</button></div>)}</div>}
          {phoneTab === "house" && <div style={{ background: "#222", padding: 14, borderRadius: 12 }}><h3>Mushin Hostel</h3><p style={{ fontSize: 12, color: "#aaa" }}>Rent due Sunday: ₦1500. Sleep restores Energy + Spirit.</p><button onClick={() => { setEnergy(100); setSpirit(100); setMoney(m => m - 1500); setLog("Slept & paid rent"); setShowPhone(false); }} style={{ background: "white", color: "black", border: "none", padding: "10px 14px", borderRadius: 8, fontWeight: 900, width: "100%", marginTop: 10 }}>Sleep & Pay Rent</button></div>}
          {phoneTab === "bank" && <div style={{ background: "#222", padding: 14, borderRadius: 12 }}><div>Balance: ₦{money}</div><div>Souls Won: {souls}</div><div style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>Souls = Kingdom currency. Alaba market gives multiplier.</div></div>}
        </div>
      )}

      {/* BOTTOM NAV LIKE LAGOS LIFE */}
      <div style={{ background: "white", borderTop: "2px solid #111", display: "flex", justifyContent: "space-around", padding: "10px 0", position: "sticky", bottom: 0 }}>
        <button onClick={() => setShowPhone(false)} style={{ background: !showPhone ? "black" : "white", color: !showPhone ? "white" : "black", border: "2px solid black", borderRadius: 20, padding: "8px 18px", fontWeight: 900 }}>Map</button>
        <button onClick={() => setShowPhone(true)} style={{ background: showPhone ? "black" : "white", color: showPhone ? "white" : "black", border: "2px solid black", borderRadius: 20, padding: "8px 18px", fontWeight: 900 }}>Phone</button>
        <button onClick={() => setLog(`Stats: Spirit ${spirit}% Energy ${energy}% Hunger ${hunger}% Souls ${souls}`)} style={{ border: "2px solid black", background: "white", borderRadius: 20, padding: "8px 18px", fontWeight: 900 }}>Stats</button>
      </div>
    </div>
  );
}