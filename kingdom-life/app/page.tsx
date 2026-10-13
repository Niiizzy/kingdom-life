/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

const NEARBY = [
  { name: "Bus stop", dist: 20, icon: "🚌" },
  { name: "CcHub", dist: 390, icon: "💡" },
  { name: "MindSpace", dist: 460, icon: "🧠" },
  { name: "Mallam Sani", dist: 680, icon: "🥜" },
];

const OTHER_PLAYERS = [
  { id: 1, name: "Tolu", avatar: "👩🏾‍🦱", x: 48, y: 45, msg: "Who dey Tejuosho?" },
  { id: 2, name: "Andy Dada", avatar: "👨🏾", x: 55, y: 58, msg: "Okay" },
  { id: 3, name: "Grace", avatar: "👩🏾", x: 42, y: 52, msg: "Lekki crusade tonight!" },
];

export default function KingdomStreetWalk() {
  const [walking, setWalking] = useState(false);
  const [playerY, setPlayerY] = useState(0); // walk forward
  const [money, setMoney] = useState(94900);
  const [online, setOnline] = useState(54);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { from: "Andy Dada", text: "Okay", avatar: "👨🏾" },
    { from: "Tolu", text: "Come to CcHub, revival", avatar: "👩🏾‍🦱" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [location, setLocation] = useState("Herbert Macaulay Way - Yaba · Tejuosho Junction");
  const [souls, setSouls] = useState(42);
  const [danfos, setDanfos] = useState([{ x: -10, y: 38 }, { x: 40, y: 35 }, { x: 80, y: 32 }]);

  // Walk forward
  useEffect(() => {
    if (!walking) return;
    const id = setInterval(() => setPlayerY(y => y + 1), 80);
    return () => clearInterval(id);
  }, [walking]);

  // Danfos move
  useEffect(() => {
    const id = setInterval(() => {
      setDanfos(ds => ds.map(d => ({...d, x: d.x > 110? -20 : d.x + 1.5 })));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Simulate incoming chat
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.3) {
        const p = OTHER_PLAYERS[Math.floor(Math.random() * OTHER_PLAYERS.length)];
        const texts = ["Pray for me", "Oshodi market souls plenty", "Danfo don carry me go", "Make we evangelize together?"];
        setMessages(m => [...m.slice(-3), { from: p.name, text: texts[Math.floor(Math.random() * texts.length)], avatar: p.avatar }]);
        setChatOpen(true);
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(m => [...m, { from: "You", text: chatInput, avatar: "✝️" }]);
    setChatInput("");
    setTimeout(() => setSouls(s => s + 1), 500);
  };

  return (
    <div style={{ background: "#87a9bf", minHeight: "100vh", fontFamily: "monospace", position: "relative", overflow: "hidden" }}>
      {/* TOP PILL - SAME AS SCREENSHOT */}
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", borderRadius: 30, padding: "8px 16px", display: "flex", gap: 16, alignItems: "center", fontSize: 12, fontWeight: 700, zIndex: 30, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <span>☀️ Tue 13 · 2:45 PM</span><span style={{ color: "#22c55e" }}>🙂 Happy</span><span>👥 38.8m</span><span style={{ color: "#16a34a" }}>● {online}k online</span><span style={{ marginLeft: 20 }}>🔊</span><span>₦{money.toLocaleString()}</span><span style={{ background: "#22c55e", color: "white", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
      </div>

      {/* STREET VIEW - 3D PERSPECTIVE */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #9ab8c9 0%, #d6e8ef 35%, #3a3a3a 35%, #2a2a2a 100%)" }}>
        {/* Buildings left */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: "55%", width: "32%", background: "#c4a77d", borderRight: "4px solid #333" }}>
          <div style={{ background: "#111", color: "#facc15", padding: "4px 8px", marginTop: 120, fontSize: 10, fontWeight: 900, display: "inline-block" }}>Tejuosho Plaza</div>
          <div style={{ display: "flex", gap: 6, marginTop: 20, padding: 6, flexWrap: "wrap" }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: 30, height: 20, background: "#222", border: "1px solid #444" }} />)}
          </div>
        </div>
        {/* Buildings right */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: "40%", width: "38%", background: "#e8dcc6", borderLeft: "4px solid #333" }}>
          <div style={{ background: "#b91c1c", color: "white", padding: "8px 12px", fontWeight: 900, fontSize: 16, transform: "skewX(-5deg)" }}>Victory Phones</div>
          <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
            <div style={{ width: "60%", height: 18, background: "white", border: "2px solid red", transform: "skewX(-10deg)" }} />
            <div style={{ width: "40%", height: 18, background: "#14b8a6", transform: "skewX(-10deg)" }} />
          </div>
          {/* Umbrellas like screenshot */}
          <div style={{ position: "absolute", bottom: 20, left: 10, right: 10, display: "flex", gap: 4 }}>
            <div style={{ width: 60, height: 30, background: "#ef4444", borderRadius: "50% 50% 0 0", transform: "rotate(-10deg)" }} />
            <div style={{ width: 60, height: 30, background: "#eab308", borderRadius: "50% 50% 0 0" }} />
            <div style={{ width: 50, height: 25, background: "#14b8a6", borderRadius: "50% 50% 0 0", transform: "rotate(10deg)" }} />
          </div>
        </div>

        {/* ROAD */}
        <div style={{ position: "absolute", left: "32%", right: "38%", top: "35%", bottom: "25%", background: "#334155", overflow: "hidden" }}>
          {/* Lane lines */}
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "repeating-linear-gradient(90deg, #facc15 0 20px, transparent 20px 40px)" }} />
          {/* Danfos */}
          {danfos.map((d, i) => (
            <div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: 70, height: 32, background: "#eab308", border: "2px solid black", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 9 }}>DANFO</div>
          ))}
        </div>

        {/* SIDEWALK - WHERE YOU WALK */}
        <div style={{ position: "absolute", left: "32%", right: "38%", bottom: "25%", top: "65%", background: "#d1c7a7", borderTop: "4px solid #facc15" }}>
          {/* Other players walking */}
          {OTHER_PLAYERS.map(p => (
            <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, textAlign: "center", transform: `translateY(${playerY % 20}px)` }}>
              <div style={{ width: 18, height: 18, background: "#333", borderRadius: "50%", border: "2px solid white" }}>{p.avatar}</div>
              <div style={{ fontSize: 7, background: "white", borderRadius: 4, padding: "1px 3px", marginTop: 2, fontWeight: 700 }}>{p.name}</div>
            </div>
          ))}
        </div>

        {/* YOU - AVATAR FROM BACK - CENTER BOTTOM */}
        <div style={{ position: "absolute", left: "50%", bottom: 120, transform: `translateX(-50%) translateY(${Math.sin(playerY) * 2}px)`, zIndex: 20 }}>
          <div style={{ width: 32, height: 32, background: "#0f172a", borderRadius: "50% 50% 0 0", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧑🏾</div>
          <div style={{ width: 28, height: 18, background: "#22c55e", margin: "0 auto", borderRadius: "4px 4px 0 0" }} />
          <div style={{ background: "black", color: "#facc15", fontSize: 8, padding: "2px 6px", borderRadius: 10, marginTop: 4, fontWeight: 900, textAlign: "center" }}>YOU • {souls} souls</div>
        </div>

        {/* Rain like screenshot */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(100deg, transparent 0 2px, rgba(255,255,255,0.15) 2px 3px)", opacity: 0.5 }} />
      </div>

      {/* NEARBY PILLS - Bottom */}
      <div style={{ position: "absolute", bottom: 130, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 25, flexWrap: "wrap", justifyContent: "center", maxWidth: "90%" }}>
        {NEARBY.map(n => (
          <button key={n.name} onClick={() => { setWalking(true); setLocation(n.name); }} style={{ background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
            {n.icon} {n.name} · {n.dist - playerY} m
          </button>
        ))}
      </div>

      {/* LOCATION BAR - Like screenshot */}
      <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: "8px 14px", display: "flex", gap: 12, alignItems: "center", fontSize: 11, fontWeight: 700, zIndex: 25, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 28, height: 28, background: "#facc15", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🧑🏾</div>
        <div>
          <div style={{ fontWeight: 900 }}>{location}</div>
          <div style={{ fontSize: 10, color: "#666" }}>Yaba · Tejuosho Junction · 🌧️ rain</div>
        </div>
        <div style={{ marginLeft: 10, background: "#e5e7eb", borderRadius: 20, padding: "4px 10px", fontSize: 10 }}>Anywhere ›</div>
      </div>

      {/* WHATSAPP REAL TIME - Bottom Right Like Screenshot */}
      {chatOpen && (
        <div style={{ position: "absolute", bottom: 10, right: 10, background: "#111", borderRadius: 16, width: 300, padding: 12, zIndex: 35, border: "2px solid #333", boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontSize: 12, fontWeight: 700 }}><span style={{ background: "#25D366", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>💬</span> WhatsApp</div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ maxHeight: 120, overflowY: "auto", marginBottom: 8 }}>
            {messages.slice(-3).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{m.avatar}</div>
                <div>
                  <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{m.from}</div>
                  <div style={{ color: "#ccc", fontSize: 11 }}>{m.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Type a reply" style={{ flex: 1, background: "#222", border: "1px solid #444", borderRadius: 20, padding: "8px 12px", color: "white", fontSize: 12 }} />
            <button onClick={sendChat} style={{ background: "#25D366", border: "none", borderRadius: 20, padding: "8px 14px", fontWeight: 900, fontSize: 12 }}>Send</button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", borderRadius: 30, padding: "6px", display: "flex", gap: 6, zIndex: 20 }}>
        <button style={{ background: "black", color: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 900, fontSize: 11 }}>🏠<br/>Home</button>
        <button style={{ background: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 11, color: "#999" }}>🛍️<br/>Buy</button>
        <button style={{ background: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 11, color: "#999" }}>🗺️<br/>Map</button>
        <button onClick={() => setChatOpen(!chatOpen)} style={{ background: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 11, position: "relative" }}>📱<br/>Phone {messages.length > 0 && <span style={{ position: "absolute", top: 2, right: 6, background: "#ef4444", color: "white", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{messages.length}</span>}</button>
      </div>

      {/* TAP TO WALK */}
      <button onClick={() => setWalking(!walking)} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: walking? "#ef4444" : "black", color: "white", border: "3px solid white", borderRadius: 30, padding: "14px 24px", fontWeight: 900, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
        {walking? "🛑 STOP WALKING" : "🚶 TAP TO WALK & INTERACT"}
      </button>

      {/* Map button top left */}
      <button style={{ position: "absolute", top: 60, left: 10, background: "white", border: "none", borderRadius: 20, padding: "6px 12px", fontWeight: 700, fontSize: 12, zIndex: 20 }}>🗺️ Map</button>
    </div>
  );
}