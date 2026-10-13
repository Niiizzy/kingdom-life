/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

const AVATARS = {
  M: ["👨‍🦱", "👨🏾", "🧑🏾‍🦱", "👨🏾‍🦲"],
  F: ["👩‍🦱", "👩🏾", "🧑🏾‍🦰", "👩🏾‍🦳"],
};
const PERSONALITIES = ["Evangelist (Bold)", "Intercessor (Prayer)", "Worshipper (Joy)", "Teacher (Deep Word)"];
const DREAMS = ["Win 1000 Souls", "Plant 10 Churches", "Host City Revival", "Campus Takeover"];

const MAP_PLACES = [
  { id: "hostel", name: "Mushin Hostel (Home)", x: 20, y: 70, color: "#57534e" },
  { id: "oshodi", name: "Oshodi Market", x: 35, y: 45, color: "#ef4444" },
  { id: "yaba", name: "Yaba Campus", x: 50, y: 30, color: "#3b82f6" },
  { id: "church", name: "Church HQ", x: 50, y: 60, color: "#22c55e" },
  { id: "alaba", name: "Alaba Soul Market", x: 15, y: 25, color: "#a855f7" },
  { id: "lekki", name: "Lekki Crusade", x: 80, y: 50, color: "#06b6d4" },
  { id: "ajah", name: "Ajah Estate", x: 85, y: 75, color: "#f59e0b" },
];

export default function KingdomLagosLifeReal() {
  // ONBOARDING
  const [step, setStep] = useState("gender"); // gender, avatar, personality, dream, tour, game
  const [gender, setGender] = useState("M");
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [personality, setPersonality] = useState(PERSONALITIES[0]);
  const [dream, setDream] = useState(DREAMS[0]);
  const [name, setName] = useState("");

  // GAME
  const [player, setPlayer] = useState({ x: 20, y: 70 });
  const [target, setTarget] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([
    { id: 1, name: "Tolu", x: 40, y: 50, avatar: "👩🏾", msg: "Who dey Oshodi?" },
    { id: 2, name: "David", x: 60, y: 55, avatar: "👨🏾", msg: "Revival tonight!" },
    { id: 3, name: "Grace", x: 15, y: 30, avatar: "👩🏾‍🦱", msg: "Alaba souls ready" },
  ]);
  const [riding, setRiding] = useState(null); // {from, to, progress}
  const [money, setMoney] = useState(5000);
  const [souls, setSouls] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [chat, setChat] = useState([{ user: "System", text: "Welcome to Kingdom Lagos! Other believers are on map." }]);
  const [chatInput, setChatInput] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [phoneTab, setPhoneTab] = useState("messages");
  const [log, setLog] = useState("Select anywhere on map - danfo will actually drive you");
  const [audioOn, setAudioOn] = useState(false);
  const mapRef = useRef(null);

  // Other players move
  useEffect(() => {
    if (step!== "game") return;
    const i = setInterval(() => {
      setOtherPlayers(ps => ps.map(p => ({
       ...p,
        x: Math.max(5, Math.min(95, p.x + (Math.random() - 0.5) * 2)),
        y: Math.max(5, Math.min(95, p.y + (Math.random() - 0.5) * 2)),
      })));
    }, 1000);
    return () => clearInterval(i);
  }, [step]);

  // Walking
  useEffect(() => {
    if (!target || riding) return;
    const id = setInterval(() => {
      setPlayer(p => {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 1) {
          clearInterval(id);
          setTarget(null);
          const place = MAP_PLACES.find(pl => Math.hypot(pl.x - target.x, pl.y - target.y) < 8);
          if (place) {
            setLog(`Arrived ${place.name}. ${place.id === "alaba"? "Alaba multiplier! 1 soul brings 5 friends" : `Win ${place.id === "lekki"? 8 : 3} souls`}`);
            setSouls(s => s + (place.id === "alaba"? 6 : place.id === "lekki"? 8 : 3));
          }
          return p;
        }
        return { x: p.x + dx * 0.07, y: p.y + dy * 0.07 };
      });
    }, 30);
    return () => clearInterval(id);
  }, [target, riding]);

  // Ride animation
  useEffect(() => {
    if (!riding) return;
    const id = setInterval(() => {
      setRiding(r => {
        if (!r) return null;
        const np = r.progress + 2;
        if (np >= 100) {
          setPlayer({ x: r.to.x, y: r.to.y });
          setLog(`Danfo dropped you at ${r.to.name}. Conductor: "Oga bring your load!"`);
          setMoney(m => m - r.cost);
          return null;
        }
        return {...r, progress: np };
      });
    }, 50);
    return () => clearInterval(id);
  }, [riding]);

  const handleMapClick = (e) => {
    if (riding) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const far = Math.hypot(x - player.x, y - player.y) > 15;
    if (far) {
      const toPlace = MAP_PLACES.find(p => Math.hypot(p.x - x, p.y - y) < 10) || { name: "Street", x, y };
      setRiding({ from: {...player }, to: { x: toPlace.x || x, y: toPlace.y || y }, name: toPlace.name, progress: 0, cost: 500 });
      setLog(`Danfo coming... Going to ${toPlace.name} - ₦500`);
    } else {
      setTarget({ x, y });
      setLog("Trekking...");
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChat(c => [...c.slice(-8), { user: name || "You", text: chatInput }]);
    // Simulate reply
    setTimeout(() => {
      const replies = ["Amen!", "I dey Oshodi now", "Come Lekki crusade!", "Pray for me", "Alaba souls plenty!"];
      const rp = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      setChat(c => [...c.slice(-8), { user: rp.name, text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1200);
    setChatInput("");
  };

  // ONBOARDING UI
  if (step!== "game") {
    return (
      <div style={{ background: "#0a0a0a", color: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "monospace" }}>
        <div style={{ background: "white", color: "black", borderRadius: 20, padding: 20, width: "100%", maxWidth: 400, border: "4px solid black" }}>
          {step === "gender" && (
            <div>
              <h2 style={{ fontWeight: 900 }}>Choose Profile</h2>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: 12, border: "3px solid black", borderRadius: 10, margin: "12px 0" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setGender("M"); setStep("avatar"); }} style={{ flex: 1, padding: 20, border: "3px solid black", borderRadius: 14, background: gender === "M"? "black" : "white", color: gender === "M"? "white" : "black", fontWeight: 900, fontSize: 20 }}>M</button>
                <button onClick={() => { setGender("F"); setStep("avatar"); }} style={{ flex: 1, padding: 20, border: "3px solid black", borderRadius: 14, background: gender === "F"? "black" : "white", color: gender === "F"? "white" : "black", fontWeight: 900, fontSize: 20 }}>F</button>
              </div>
              <button onClick={() => name && setStep("avatar")} style={{ marginTop: 14, width: "100%", background: "black", color: "white", padding: 14, borderRadius: 10, fontWeight: 900, border: "none" }}>Continue →</button>
            </div>
          )}
          {step === "avatar" && (
            <div>
              <h2 style={{ fontWeight: 900 }}>Avatar Attire</h2>
              <p style={{ fontSize: 12 }}>Pick your look - Kingdom drip</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                {AVATARS[gender].map((av, i) => (
                  <button key={i} onClick={() => setAvatarIdx(i)} style={{ fontSize: 40, padding: 20, border: avatarIdx === i? "4px solid #22c55e" : "3px solid black", borderRadius: 14, background: "white" }}>{av}</button>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={() => setStep("gender")} style={{ flex: 1, padding: 12, border: "3px solid black", borderRadius: 10, background: "white" }}>Back</button>
                <button onClick={() => setStep("personality")} style={{ flex: 2, background: "black", color: "white", padding: 12, borderRadius: 10, fontWeight: 900, border: "none" }}>Next</button>
              </div>
            </div>
          )}
          {step === "personality" && (
            <div>
              <h2 style={{ fontWeight: 900 }}>Personality</h2>
              {PERSONALITIES.map(p => (
                <button key={p} onClick={() => setPersonality(p)} style={{ width: "100%", textAlign: "left", padding: 14, border: personality === p? "3px solid #22c55e" : "3px solid black", borderRadius: 12, marginBottom: 8, background: "white", fontWeight: 700 }}>{p}</button>
              ))}
              <button onClick={() => setStep("dream")} style={{ marginTop: 10, width: "100%", background: "black", color: "white", padding: 14, borderRadius: 10, fontWeight: 900, border: "none" }}>Next → Dream</button>
            </div>
          )}
          {step === "dream" && (
            <div>
              <h2 style={{ fontWeight: 900 }}>Dream / Goal as Believer</h2>
              {DREAMS.map(d => (
                <button key={d} onClick={() => setDream(d)} style={{ width: "100%", textAlign: "left", padding: 14, border: dream === d? "3px solid #22c55e" : "3px solid black", borderRadius: 12, marginBottom: 8, background: "white", fontWeight: 700 }}>{d}</button>
              ))}
              <button onClick={() => setStep("tour")} style={{ marginTop: 10, width: "100%", background: "#22c55e", color: "white", padding: 14, borderRadius: 10, fontWeight: 900, border: "none" }}>Start Quick Tour →</button>
            </div>
          )}
          {step === "tour" && (
            <div>
              <h2 style={{ fontWeight: 900 }}>Quick Tour</h2>
              <div style={{ fontSize: 13, lineHeight: "18px", marginTop: 8 }}>
                <p>🏠 <b>Wake in Mushin</b> - Like Lagos Life, you start in hostel.</p>
                <p>🗺️ <b>Tap anywhere</b> - If near, you trek. If far, danfo actually drives with you inside.</p>
                <p>😠 <b>Agbero</b> - Will block you. Preach to win him.</p>
                <p>💬 <b>Chat</b> - Talk to other believers live on map.</p>
                <p>📱 <b>Phone</b> - Messages + Bible Browser + Bank.</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setStep("game")} style={{ flex: 1, padding: 12, border: "3px solid black", borderRadius: 10, background: "white" }}>Skip Tour</button>
                <button onClick={() => setStep("game")} style={{ flex: 2, background: "black", color: "white", padding: 12, borderRadius: 10, fontWeight: 900, border: "none" }}>Enter Kingdom Lagos →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN GAME
  return (
    <div style={{ background: "#f2efe7", minHeight: "100vh", fontFamily: "monospace", display: "flex", flexDirection: "column" }}>
      {/* Top */}
      <div style={{ background: "white", borderBottom: "3px solid black", padding: "8px 10px", display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 11 }}>
        <div>{AVATARS[gender][avatarIdx]} {name} • {dream} • ₦{money} • Souls {souls}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setAudioOn(!audioOn)} style={{ border: "2px solid black", background: audioOn? "#22c55e" : "white", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>{audioOn? "🔊 Audio" : "🔇"}</button>
          <div style={{ background: energy < 30? "#ef4444" : "#22c55e", color: "white", padding: "2px 8px", borderRadius: 20 }}>⚡{energy}%</div>
        </div>
      </div>

      {/* MAP - REAL WALKING */}
      <div ref={mapRef} onClick={handleMapClick} style={{ position: "relative", flex: 1, height: "55vh", background: "#e8dcc6", overflow: "hidden", cursor: "crosshair" }}>
        {/* Roads */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 18, background: "#222" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 18, background: "#222" }} />
        {/* Places */}
        {MAP_PLACES.map(p => (
          <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", background: p.color, color: "white", padding: "5px 8px", borderRadius: 8, fontSize: 10, fontWeight: 800, border: "2px solid black" }}>{p.name}</div>
        ))}
        {/* Other players */}
        {otherPlayers.map(op => (
          <div key={op.id} style={{ position: "absolute", left: `${op.x}%`, top: `${op.y}%`, transform: "translate(-50%, -50%)", textAlign: "center", transition: "all 1s linear" }}>
            <div style={{ fontSize: 18 }}>{op.avatar}</div><div style={{ fontSize: 8, background: "black", color: "white", borderRadius: 6, padding: "1px 4px" }}>{op.name}</div>
          </div>
        ))}
        {/* Player */}
        <div style={{ position: "absolute", left: `${player.x}%`, top: `${player.y}%`, transform: "translate(-50%, -50%)", zIndex: 10, transition: riding? "none" : "all 0.1s linear" }}>
          <div style={{ fontSize: 26, background: "white", borderRadius: "50%", border: "3px solid #22c55e", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{AVATARS[gender][avatarIdx]}</div>
        </div>
        {/* Danfo ride visual */}
        {riding && (
          <div style={{ position: "absolute", left: `${riding.from.x + (riding.to.x - riding.from.x) * riding.progress / 100}%`, top: `${riding.from.y + (riding.to.y - riding.from.y) * riding.progress / 100}%`, transform: "translate(-50%, -50%)", background: "#eab308", border: "3px solid black", borderRadius: 8, padding: "4px 8px", fontWeight: 900, fontSize: 10, zIndex: 15 }}>
            🚌 DANFO {riding.progress}% • {riding.name}
          </div>
        )}
        {target &&!riding && <div style={{ position: "absolute", left: `${target.x}%`, top: `${target.y}%`, width: 8, height: 8, background: "red", borderRadius: "50%", border: "2px solid white", transform: "translate(-50%, -50%)" }} />}
      </div>

      <div style={{ background: "black", color: "#facc15", padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>{log} {riding? `| Riding ${riding.progress}%` : ""}</div>

      {/* Chat - real time */}
      <div style={{ background: "white", borderTop: "3px solid black", padding: 8, height: 140, display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 900, fontSize: 11, marginBottom: 4 }}>Live Chat with Believers 💬</div>
        <div style={{ flex: 1, overflowY: "auto", fontSize: 11 }}>
          {chat.map((c, i) => <div key={i}><b>{c.user}:</b> {c.text}</div>)}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Type message..." style={{ flex: 1, border: "2px solid black", borderRadius: 20, padding: "8px 12px", fontSize: 12 }} />
          <button onClick={sendChat} style={{ background: "black", color: "white", border: "none", borderRadius: 20, padding: "8px 14px", fontWeight: 900 }}>Send</button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "white", borderTop: "3px solid black", display: "flex", justifyContent: "space-around", padding: "8px 0" }}>
        <button onClick={() => setShowPhone(false)} style={{ background:!showPhone? "black" : "white", color:!showPhone? "white" : "black", border: "2px solid black", borderRadius: 20, padding: "8px 16px", fontWeight: 900, fontSize: 12 }}>Map</button>
        <button onClick={() => setShowPhone(true)} style={{ background: showPhone? "black" : "white", color: showPhone? "white" : "black", border: "2px solid black", borderRadius: 20, padding: "8px 16px", fontWeight: 900, fontSize: 12 }}>Phone 📱</button>
        <button onClick={() => setEnergy(100)} style={{ background: "white", border: "2px solid black", borderRadius: 20, padding: "8px 16px", fontWeight: 900, fontSize: 12 }}>Sleep</button>
      </div>

      {/* PHONE - Messages + Browser */}
      {showPhone && (
        <div style={{ position: "fixed", inset: 0, background: "#111", zIndex: 40, padding: 12, color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontWeight: 900 }}>Phone - {AVATARS[gender][avatarIdx]} {name}</h3>
            <button onClick={() => setShowPhone(false)} style={{ background: "white", color: "black", border: "none", borderRadius: 20, padding: "6px 12px", fontWeight: 900 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            {["messages", "bible", "bank"].map(t => <button key={t} onClick={() => setPhoneTab(t)} style={{ background: phoneTab === t? "white" : "#333", color: phoneTab === t? "black" : "white", border: "none", padding: "8px 12px", borderRadius: 20, fontWeight: 800, textTransform: "capitalize" }}>{t}</button>)}
          </div>
          {phoneTab === "messages" && <div>{chat.map((c, i) => <div key={i} style={{ background: "#222", padding: 8, borderRadius: 10, marginBottom: 6, fontSize: 12 }}><b>{c.user}</b>: {c.text}</div>)}</div>}
          {phoneTab === "bible" && <div style={{ background: "#222", padding: 12, borderRadius: 12 }}><div style={{ fontWeight: 800 }}>Bible Browser (Internet)</div><div style={{ fontSize: 12, marginTop: 8, color: "#aaa" }}>Search: "How to win souls in market"</div><div style={{ background: "white", color: "black", padding: 10, borderRadius: 8, marginTop: 8, fontSize: 12 }}>Mark 16:15 - Go into all the world and preach the gospel... Your dream: {dream} - Personality: {personality}</div></div>}
          {phoneTab === "bank" && <div style={{ background: "#222", padding: 12, borderRadius: 12 }}><div>Balance: ₦{money}</div><div>Souls: {souls} (Alaba multiplier active)</div><div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>Tip: Trek to win roadside souls, take danfo for far crusades.</div></div>}
        </div>
      )}

      {audioOn && <audio autoPlay loop src="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" style={{ display: "none" }} />}
    </div>
  );
}