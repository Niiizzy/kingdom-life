/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";

const SCENES = { HOME: "home", STREET: "street", BUS_STOP: "busstop", ENCOUNTER: "encounter", LOCATION: "location" };

export default function KingdomStreetLife() {
  const [scene, setScene] = useState(SCENES.HOME);
  const [time, setTime] = useState(5); // 5am
  const [money, setMoney] = useState(5000);
  const [energy, setEnergy] = useState(90);
  const [souls, setSouls] = useState(0);
  const [log, setLog] = useState("5:00 AM - Alarm rings in Mushin. NEPA just took light. Time to wake.");
  const [danfoX, setDanfoX] = useState(-120);
  const [playerX, setPlayerX] = useState(20);
  const [busPassengers, setBusPassengers] = useState(3);
  const [tout, setTout] = useState(null); // agbero
  const [currentArea, setCurrentArea] = useState("Mushin Hostel");
  const [isOnBus, setIsOnBus] = useState(false);

  // Danfo always moving on street
  useEffect(() => {
    if (scene!== SCENES.STREET && scene!== SCENES.BUS_STOP) return;
    const i = setInterval(() => {
      setDanfoX(x => {
        if (x > 1000) {
          setBusPassengers(Math.floor(Math.random() * 6) + 2);
          return -150;
        }
        return x + 4;
      });
    }, 40);
    return () => clearInterval(i);
  }, [scene]);

  // Danfo stops when near player
  useEffect(() => {
    if (Math.abs(danfoX - playerX) < 30 && danfoX > 0 &&!isOnBus && scene === SCENES.STREET) {
      setScene(SCENES.BUS_STOP);
      setLog(`Danfo stops! Conductor: "Oshodi! Oshodi! Enter with your change o!" - ${busPassengers} people inside.`);
    }
  }, [danfoX, playerX]);

  // Random tout
  useEffect(() => {
    if (scene === SCENES.STREET &&!tout && Math.random() < 0.008) {
      setTout({ x: playerX + 100, money: 500, preached: false });
      setLog("Agbero from nowhere: 'Oga, you dey pass without settling us?'");
    }
  }, [playerX, scene, tout]);

  const wakeUp = () => {
    setTime(6);
    setLog("You fetched water from well, prayed, wore your evangelism shirt. Leave house to preach.");
  };

  const leaveHouse = () => {
    setScene(SCENES.STREET);
    setPlayerX(20);
    setTime(6.5);
    setLog("You step into Mushin street. Generators noise, bread seller shouting. Danfo coming...");
  };

  const walkStreet = () => {
    setPlayerX(x => Math.min(850, x + 35));
    setEnergy(e => Math.max(0, e - 2));
    // random soul on street
    if (Math.random() < 0.3) {
      setLog("Mama selling akara: 'My pikin sick o' - You pray for her. +1 soul");
      setSouls(s => s + 1);
    }
  };

  const enterDanfo = () => {
    if (money < 500) { setLog("No ₦500 for danfo! Trek."); return; }
    setMoney(m => m - 500);
    setIsOnBus(true);
    setLog("You squeeze inside danfo. No seat, you hang on door. Conductor: 'Owo da?'");
    setTimeout(() => {
      setScene(SCENES.LOCATION);
      setCurrentArea("Oshodi Market");
      setIsOnBus(false);
      setPlayerX(400);
      setLog("Oshodi! Market noise, loud speakers. Thousands need Jesus here. Preach!");
      // Tout follows to market
      if (Math.random() < 0.7) {
        setTout({ x: 300, money: 300, preached: false });
      }
    }, 2000);
  };

  const handleTout = (action) => {
    if (action === "pay") {
      setMoney(m => m - tout.money);
      setLog(`You paid agbero ₦${tout.money}. He says 'You be correct guy'. But you lost money.`);
      setTout(null);
    } else if (action === "preach") {
      setSouls(s => s + 3);
      setLog("You: 'Jesus paid your debt on cross, no need to collect from people'. Agbero pauses... 'You sure?' He gives life to Christ! +3 souls (Alaba multiplier: he calls 2 friends!)");
      setSouls(s => s + 2);
      setTout(null);
      setTimeout(() => setLog("Those 2 friends also come! Street revival in Oshodi! +2 more"), 1500);
    } else {
      setLog("You try to dodge. Agbero vex, drags your shirt. -10 energy");
      setEnergy(e => Math.max(0, e - 10));
      setTout(null);
    }
  };

  const preachInLocation = () => {
    if (energy < 10) { setLog("Tired! No energy to preach. Buy gala or sleep."); return; }
    const soulsWon = currentArea === "Oshodi Market"? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 3) + 1;
    setSouls(s => s + soulsWon);
    setEnergy(e => e - 8);
    const messages = [
      `You mount small stool, shout 'Jesus loves you!' Market women stop. +${soulsWon} souls`,
      `Okada man parks: 'Pastor preach for me'. You pray. +${soulsWon} souls`,
      `Danfo driver gives you mic: 'Evangelist, talk to my passengers!' +${soulsWon} souls`,
    ];
    setLog(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <div style={{ background: "#0f0f0f", color: "white", minHeight: "100vh", fontFamily: "monospace", overflow: "hidden" }}>
      {/* TOP HUD - LAGOS LIFE STYLE */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#facc15", color: "black", fontWeight: 900, fontSize: 12, borderBottom: "3px solid black" }}>
        <div>{time}:00 AM • {currentArea} • ₦{money} • Souls {souls}</div>
        <div>Energy {energy}% • {isOnBus? "🚌 ON DANFO" : "🚶 TREKKING"}</div>
      </div>

      {/* SCENE: HOME - WAKE UP */}
      {scene === SCENES.HOME && (
        <div style={{ padding: 16, background: "#1a1a1a", minHeight: "70vh" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ background: "#2a2a2a", border: "3px solid #333", borderRadius: 16, padding: 16, position: "relative", height: 340 }}>
              <div style={{ position: "absolute", top: 20, left: 20, fontSize: 50 }}>🛏️</div>
              <div style={{ position: "absolute", top: 20, right: 20, fontSize: 40 }}>🪣</div>
              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: 60, height: 80, background: "#8B4513", border: "3px solid black", borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>🚪</div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 28, height: 28, background: "#22c55e", borderRadius: "50%", border: "3px solid white" }}>✝️</div>
              <div style={{ position: "absolute", bottom: 60, left: 20, fontSize: 12, color: "#888" }}>Mushin Face-Me-I-Face-You - NEPA no light, but you get torch for devotion</div>
            </div>
            <h2 style={{ fontWeight: 900, marginTop: 16 }}>You wake up in Mushin Hostel</h2>
            <p style={{ color: "#aaa", fontSize: 13 }}>Your room: bucket of water, small bed, evangelism tracts on floor. Outside, street already loud.</p>
            <button onClick={wakeUp} style={{ background: "white", color: "black", border: "none", padding: "12px 20px", borderRadius: 10, fontWeight: 900, marginTop: 10, width: "100%" }}>DO MORNING DEVOTION (+10 Spirit)</button>
            <button onClick={leaveHouse} style={{ background: "#22c55e", color: "white", border: "none", padding: "14px 20px", borderRadius: 10, fontWeight: 900, marginTop: 10, width: "100%" }}>LEAVE HOUSE → ENTER STREET</button>
          </div>
        </div>
      )}

      {/* SCENE: STREET - REAL LAGOS STREET WITH DANFO */}
      {scene === SCENES.STREET && (
        <div style={{ position: "relative", height: "70vh", background: "#fde68a", overflow: "hidden", borderBottom: "4px solid black" }} onClick={walkStreet}>
          {/* Sky */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "#87CEEB" }}>
            <div style={{ position: "absolute", top: 20, left: "20%", background: "white", borderRadius: 20, padding: "4px 12px", fontSize: 10, color: "black" }}>NEPA pole - wire dey spark</div>
          </div>
          {/* Road */}
          <div style={{ position: "absolute", top: 160, left: 0, right: 0, height: 120, background: "#333", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", borderTop: "4px dashed #facc15", marginTop: 40 }} />
            {/* DANFO */}
            <div style={{ position: "absolute", left: danfoX, top: 20, width: 110, height: 50, background: "#eab308", border: "3px solid black", borderRadius: 8, display: "flex", alignItems: "center", padding: 4, transition: "left 0.1s linear" }}>
              <div style={{ fontSize: 10, fontWeight: 900, lineHeight: "10px" }}>OSHODI<br/>VIA<br/>YABA</div>
              <div style={{ marginLeft: 6, fontSize: 16 }}>🚌</div>
              <div style={{ fontSize: 9, marginLeft: 4 }}>{busPassengers} ppl</div>
            </div>
          </div>
          {/* Sidewalk */}
          <div style={{ position: "absolute", top: 280, left: 0, right: 0, height: 120, background: "#d1c7a7", borderTop: "3px solid black" }}>
            {/* Player */}
            <div style={{ position: "absolute", left: playerX, top: 20, width: 32, height: 32, background: "#22c55e", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, transition: "left 0.3s" }}>✝️</div>
            {/* NPCs - bread seller, etc */}
            <div style={{ position: "absolute", left: 250, top: 30, fontSize: 20 }}>🍞<div style={{ fontSize: 8, color: "black", fontWeight: 800 }}>Bread! Bread!</div></div>
            <div style={{ position: "absolute", left: 500, top: 25, fontSize: 20 }}>🥜<div style={{ fontSize: 8, color: "black" }}>Groundnut</div></div>
            {/* Tout */}
            {tout && (
              <div style={{ position: "absolute", left: tout.x, top: 15, background: "#ef4444", color: "white", padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 900, border: "2px solid black" }}>
                😠 AGBERO: Oga settle!
              </div>
            )}
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "black", color: "#facc15", padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>TAP STREET TO TREK → DANFO WILL STOP FOR YOU</div>
        </div>
      )}

      {/* BUS STOP SCENE */}
      {scene === SCENES.BUS_STOP && (
        <div style={{ position: "relative", height: "70vh", background: "#fde68a" }}>
          <div style={{ position: "absolute", top: 100, left: danfoX, width: 120, height: 70, background: "#eab308", border: "4px solid black", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", fontWeight: 900, color: "black", fontSize: 12 }}>DANFO STOPPED<br/>DOOR OPEN</div>
          </div>
          <div style={{ position: "absolute", top: 200, left: playerX, width: 32, height: 32, background: "#22c55e", borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>✝️</div>
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, background: "white", color: "black", padding: 16, borderTop: "4px solid black" }}>
            <h3 style={{ margin: 0, fontWeight: 900 }}>Bus Stop - Oshodi?</h3>
            <p style={{ fontSize: 12 }}>Conductor: "Enter! Enter! Two seats remain!"</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={enterDanfo} style={{ background: "#eab308", border: "3px solid black", padding: "12px 18px", borderRadius: 10, fontWeight: 900, flex: 1 }}>ENTER DANFO -₦500</button>
              <button onClick={() => setScene(SCENES.STREET)} style={{ background: "white", border: "3px solid black", padding: "12px 18px", borderRadius: 10, fontWeight: 700, flex: 1 }}>TREK CONTINUE</button>
            </div>
          </div>
        </div>
      )}

      {/* LOCATION SCENE */}
      {scene === SCENES.LOCATION && (
        <div style={{ position: "relative", height: "70vh", background: currentArea === "Oshodi Market"? "#fca5a5" : "#a7f3d0" }}>
          <div style={{ padding: 16 }}>
            <h2 style={{ color: "black", fontWeight: 900, margin: 0 }}>{currentArea} - {time}:30 AM</h2>
            <div style={{ background: "white", color: "black", border: "3px solid black", borderRadius: 12, padding: 12, marginTop: 12 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontSize: 30 }}>👩‍🦰👨‍🦱👩‍🦳👨‍🦰</div>
                <div style={{ fontSize: 12 }}>Crowd of traders, students, drivers. Some tired, some arguing. All need hope.</div>
              </div>
              {tout && <div style={{ background: "#ef4444", color: "white", padding: 8, borderRadius: 8, marginTop: 10, fontWeight: 800 }}>Agbero followed you here! Wants ₦{tout.money}</div>}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={preachInLocation} style={{ background: "#22c55e", color: "white", border: "3px solid black", padding: "14px 20px", borderRadius: 12, fontWeight: 900 }}>🎤 PREACH ON STREET</button>
              <button onClick={() => { setScene(SCENES.HOME); setCurrentArea("Mushin Hostel"); setTime(19); setLog("You trekked back home. Evening devotion time."); }} style={{ background: "black", color: "white", border: "3px solid black", padding: "14px 20px", borderRadius: 12, fontWeight: 700 }}>GO HOME</button>
            </div>
          </div>
        </div>
      )}

      {/* TOUT ENCOUNTER MODAL */}
      {tout && scene!== SCENES.HOME && (
        <div style={{ position: "fixed", bottom: 80, left: 10, right: 10, background: "white", color: "black", border: "4px solid #ef4444", borderRadius: 16, padding: 14, zIndex: 30 }}>
          <div style={{ fontWeight: 900, color: "#ef4444" }}>😠 AGBERO BLOCKS YOUR WAY</div>
          <div style={{ fontSize: 13, margin: "8px 0", fontWeight: 600 }}>"Oga, this na our area. You must settle us ₦{tout.money} before you preach here."</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleTout("pay")} style={{ flex: 1, background: "#facc15", border: "2px solid black", padding: "10px", borderRadius: 10, fontWeight: 800 }}>Pay ₦{tout.money}</button>
            <button onClick={() => handleTout("preach")} style={{ flex: 2, background: "#22c55e", color: "white", border: "2px solid black", padding: "10px", borderRadius: 10, fontWeight: 900 }}>PREACH TO HIM ✝️</button>
            <button onClick={() => handleTout("dodge")} style={{ flex: 1, background: "#ddd", border: "2px solid black", padding: "10px", borderRadius: 10, fontWeight: 700 }}>Dodge</button>
          </div>
        </div>
      )}

      {/* LOG */}
      <div style={{ background: "white", color: "black", padding: "10px 14px", fontSize: 12, fontWeight: 700, borderTop: "3px solid black", minHeight: 50 }}>{log}</div>

      {/* BOTTOM - TAP TO WALK */}
      {scene === SCENES.STREET && <button onClick={walkStreet} style={{ width: "100%", background: "black", color: "#facc15", border: "none", padding: "16px", fontWeight: 900, fontSize: 14 }}>TAP HERE TO TREK FORWARD + WIN ROADSIDE SOULS</button>}
    </div>
  );
}