import React, { useState, useRef, useEffect } from "react";
import styles from "./HomePage.module.css";

import Narrador from "../../components/Narrator";
import User from "../../components/User";
import NarratorControls from "../../components/NarratorControls";

import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();
  const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

  const [playerLife, setPlayerLife] = useState(100);
  const [currentUser, setCurrentUser] = useState(null);

  const [currentFala, setCurrentFala] = useState(null);
  const [repeatTrigger, setRepeatTrigger] = useState(0);
  const [skipSignal, setSkipSignal] = useState(0);

  const [userResponse, setUserResponse] = useState("");
  const [hint, setHint] = useState("");

  // ================== CARREGA USER ==================
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const json = JSON.parse(u);
      setCurrentUser(json);
      setPlayerLife(json.vida ?? 100);
    }
  }, []);

  // ================== BOTÕES DO NARRADOR ==================

  const handleSkip = () => setSkipSignal(s => s + 1);
  const handleRepeat = () => setRepeatTrigger(r => r + 1);

  const handleHint = async () => {
    if (!currentFala?.etapa) return setHint("Nenhuma dica disponível.");

    const res = await fetch(`${API_URL}/api/narrador/dica/${currentFala.etapa}`);
    const data = await res.json();

    setHint(data?.dica || "Nenhuma dica disponível.");
  };

  const handleSend = async () => {
    if (!userResponse.trim()) return;

    const payload = {
      etapa: currentFala?.etapa,
      resposta: userResponse,
      usuario_id: currentUser?.id || null
    };

    const res = await fetch(`${API_URL}/api/narrador/resposta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data?.mensagem || "Resposta enviada.");

    setUserResponse("");
  };

  return (
    <div className={styles.page}>

      {/* ===== ÍCONE DO USUÁRIO ===== */}
      <div className={styles.topRight}>
        <User playerLife={playerLife} onClick={() => navigate("/user")} />
      </div>

      {/* ===== CAIXA DO NARRADOR ===== */}
      <div className={styles.narratorSection}>
        <Narrador
          etapa="inicio"
          usuario={currentUser}
          repeatTrigger={repeatTrigger}
          skipSignal={skipSignal}
          onFalaReady={setCurrentFala}
        />
      </div>

      {/* ===== INPUT DE RESPOSTA ===== */}
      <input
        className={styles.responseInput}
        type="text"
        placeholder="Digite sua resposta..."
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
      />

      {/* ===== CONTROLES DO NARRADOR ===== */}
      <NarratorControls
        onSkip={handleSkip}
        onRepeat={handleRepeat}
        onHint={handleHint}
        onSend={handleSend}
      />

      {hint && <p className={styles.hintBox}>💡 {hint}</p>}

      {/* ===== BOTÕES DOS LABS ===== */}
      <div className={styles.labs}>
        <button onClick={() => navigate("/lab1")}>Lab-01</button>
        <button onClick={() => navigate("/lab2")}>Lab-02</button>
      </div>

    </div>
  );
}

export default HomePage;
