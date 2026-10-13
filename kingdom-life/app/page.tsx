/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";

const AREAS = {
  surulere: {name: "Surulere", x: 100, y: 300, color: "#a855f7", risk: 0.2, reward: 2},
  oshodi: {name: "Oshodi", x: 250, y: 250, color: "#ef4444", risk: 0.4, reward: 5},
  yaba: {name: "Yaba", x: 400, y: 250, color: "#22c55e", risk: 0.15, reward: 1},
  ikeja: {name: "Ikeja", x: 400, y: 100, color: "#3b82f6", risk: 0.25, reward: 3},
  lekki: {name: "Lekki", x: 650, y: 280, color: "#06b6d4", risk: 0.15, reward: 4},
  ajah: {name: "Ajah", x: 650, y: 400, color: "#f59e0b", risk: 0.1, reward: 2},
  alaba: {name: "Alaba", x: 100, y: 100, color: "#ec4899", risk: 0.3, reward: 6},
};
const AREA_IDS = Object.keys(AREAS);

export default function Game() {
  const [game, setGame] = useState({ spirit: 100, souls: 0, money: 5000, player: {x: 400, y: 250}, lang: "EN" });
  const [currentArea, setCurrentArea] = useState(null);
  const [message, setMessage] = useState("Use WASD or joystick to walk!");
  const keysRef = useRef({});

  // Load save
  useEffect(() => {
    try {
      const s = localStorage.getItem("kingdom-life-v2");
      if (s) setGame(JSON.parse(s));
    } catch {}
  }, []);
  // Save
  useEffect(() => { localStorage.setItem("kingdom-life-v2", JSON.stringify(game)); }, [game]);

  // Keyboard
  useEffect(() => {
    const d = (e) => { keysRef.current[e.key.toLowerCase()] = true; };
    const u = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, []);

  // MOVEMENT LOOP - FIXED
  useEffect(() => {
    const loop = setInterval(() => {
      const k = keysRef.current;
      let dx = 0, dy = 0;
      if (k["w"] || k["arrowup"]) dy = -4;
      if (k["s"] || k["arrowdown"]) dy = 4;
      if (k["a"] || k["arrowleft"]) dx = -4;
      if (k["d"] || k["arrowright"]) dx = 4;

      if (dx!==0 || dy!==0) {
        setGame(g => {
          let nx = Math.max(15, Math.min(785, g.player.x + dx));
          let ny = Math.max(15, Math.min(485, g.player.y + dy));
          // check area
          for (let id of AREA_IDS) {
            let a = AREAS[id];
            if (Math.hypot(nx - a.x, ny - a.y) < 60) {
              if (currentArea!== id) {
                setCurrentArea(id);
                setMessage(`Entered ${a.name} - Press WIN SOUL!`);
              }
              break;
            }
          }
          return {...g, player: {x: nx, y: ny}};
        });
      }
    }, 16);
    return () => clearInterval(loop);
  }, [currentArea]);

  const winSoul = () => {
    if (!currentArea) { setMessage("Walk into a colored area first!"); return; }
    const area = AREAS[currentArea];
    if (Math.random() < area.risk) {
      setGame(g => ({...g, money: g.money - 1000, spirit: Math.min(100, g.spirit + 10)}));
      setMessage("Area boy! -N1000 but +10 Spirit");
    } else {
      setGame(g => ({...g, souls: g.souls + area.reward, spirit: Math.min(100, g.spirit + 5)}));
      setMessage(`You won ${area.reward} souls in ${area.name}!`);
    }
  };

  const goTo = (id) => {
    if (game.money < 500) { setMessage("No money for danfo! Need N500"); return; }
    setGame(g => ({...g, money: g.money - 500, player: {x: AREAS[id].x, y: AREAS[id].y}}));
    setCurrentArea(id);
    setMessage(`Danfo to ${AREAS[id].name}!`);
  };

  // Touch controls
  const hold = (key, v) => {
    if (v) keysRef.current[key] = true;
    else delete keysRef.current[key];
  };

  return (
    <div style={{background: "#0f172a", color: "white", minHeight: "100vh", padding: 10, userSelect: "none"}}>
      <h1 style={{fontWeight: 900}}>KINGDOM LIFE - GTA LAGOS v3 WORKING</h1>
      <div style={{display: "flex", gap: 8, margin: "10px 0", flexWrap: "wrap"}}>
        <span style={{background: "#1e293b", padding: "6px 12px", borderRadius: 6}}>Spirit: {game.spirit}</span>
        <span style={{background: "#1e293b", padding: "6px 12px", borderRadius: 6}}>Souls: {game.souls}</span>
        <span style={{background: "#1e293b", padding: "6px 12px", borderRadius: 6}}>Money: ₦{game.money}</span>
      </div>

      <div style={{position: "relative", background: "#fde68a", border: "4px solid black", width: "100%", maxWidth: 800, height: 500, borderRadius: 12, overflow: "hidden"}}>
        {AREA_IDS.map(id => {
          let a = AREAS[id];
          return <div key={id} style={{position: "absolute", left: a.x-35, top: a.y-20, background: currentArea===id? "white" : a.color, color: currentArea===id? "black" : "white", padding: "6px 10px", borderRadius: 8, fontWeight: 800, border: "2px solid black", fontSize: 12}}>{a.name}</div>
        })}
        <div style={{position: "absolute", left: game.player.x-12, top: game.player.y-12, width: 26, height: 26, background: "#22c55e", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16}}>✝️</div>
      </div>

      <p style={{color: "#facc15", fontWeight: 800, margin: "12px 0", minHeight: 20}}>{message}</p>

      {/* CONTROLS - ALWAYS VISIBLE */}
      <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
        <button onClick={winSoul} style={{background: "#22c55e", padding: "14px 24px", borderRadius: 10, fontWeight: 900, border: "none", color: "white", fontSize: 16}}>WIN SOUL</button>
        <button onClick={()=>{setGame(g=>({...g, spirit: 100})); setMessage("Devotion done! Spirit 100");}} style={{background: "#3b82f6", padding: "14px 24px", borderRadius: 10, border: "none", color: "white"}}>DEVOTION</button>
      </div>

      {/* JOYSTICK FOR MOBILE */}
      <div style={{marginTop: 15, display: "grid", gridTemplateColumns: "60px 60px 60px", gap: 5, width: 190}}>
        <div></div>
        <button onTouchStart={()=>hold("w", true)} onTouchEnd={()=>hold("w", false)} onMouseDown={()=>hold("w", true)} onMouseUp={()=>hold("w", false)} style={{height: 55, fontSize: 22, borderRadius: 10}}>↑</button>
        <div></div>
        <button onTouchStart={()=>hold("a", true)} onTouchEnd={()=>hold("a", false)} onMouseDown={()=>hold("a", true)} onMouseUp={()=>hold("a", false)} style={{height: 55, fontSize: 22, borderRadius: 10}}>←</button>
        <button onTouchStart={()=>hold("s", true)} onTouchEnd={()=>hold("s", false)} onMouseDown={()=>hold("s", true)} onMouseUp={()=>hold("s", false)} style={{height: 55, fontSize: 22, borderRadius: 10}}>↓</button>
        <button onTouchStart={()=>hold("d", true)} onTouchEnd={()=>hold("d", false)} onMouseDown={()=>hold("d", true)} onMouseUp={()=>hold("d", false)} style={{height: 55, fontSize: 22, borderRadius: 10}}>→</button>
      </div>

      <div style={{marginTop: 15, display: "flex", gap: 6, flexWrap: "wrap"}}>
        {AREA_IDS.map(id => (
          <button key={id} onClick={()=>goTo(id)} disabled={currentArea===id} style={{background: currentArea===id? "#555" : "#eab308", padding: "8px 12px", borderRadius: 8, border: "none", fontWeight: 700}}>{id} (-500)</button>
        ))}
      </div>
    </div>
  );
}