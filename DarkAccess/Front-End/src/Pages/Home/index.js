import React, { useState, useRef, useEffect } from "react";
import styles from "./HomePage.module.css";

import Narrador from "../../components/Narrator";
import User from "../../components/User";
import NarratorControls from "../../components/NarratorControls";

import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();
  const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

  const [currentUser, setCurrentUser] = useState(null);
  const [playerLife, setPlayerLife] = useState(100);

  const [currentFala, setCurrentFala] = useState(null);
  const [repeatTrigger, setRepeatTrigger] = useState(0);
  const [skipSignal, setSkipSignal] = useState(0);

  const [userResponse, setUserResponse] = useState("");
  const [hint, setHint] = useState("");

  const [etapa, setEtapa] = useState(null);
  const [lab1Liberado, setLab1Liberado] = useState(false);
  const [lab2Liberado, setLab2Liberado] = useState(false);

  // ===================================================
  // 1) CARREGA USUÁRIO NA MONTAGEM DA HOME
  // ===================================================
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const json = JSON.parse(u);
      setCurrentUser(json);
      setPlayerLife(json.vida ?? 100);
    }
  }, []);

  // ===================================================
  // 2) BUSCA CONQUISTAS DO USUÁRIO PARA LIBERAR LABS
  // ===================================================
  useEffect(() => {
    if (!currentUser) return;

    const loadConquistas = async () => {
      const res = await fetch(`${API_URL}/api/usuario/${currentUser.id}/conquistas`);
      const data = await res.json();

      const conquistas = data.conquistas || [];

      if (conquistas.some(c => c.codigo === "lab01_concluido")) {
        setLab1Liberado(true);
      }

      if (conquistas.some(c => c.codigo === "lab02_concluido")) {
        setLab2Liberado(true);
      }
    };

    loadConquistas();
  }, [currentUser]);

  // ===================================================
  // 3) DEFINE ETAPA INICIAL
  // ===================================================
  useEffect(() => {
    if (!currentUser) return;

    // primeira vez na superfície?
    if (currentUser.visto_surface !== "S") {
      setEtapa("explicacao_surface_deep_dark");

      // marca que o usuário passou pela explicação
      fetch(`${API_URL}/api/usuario/${currentUser.id}/marcar_surface`, { method: "POST" });
    } 
    else {
      setEtapa("inicio_surface");
    }

  }, [currentUser]);


  // ===================================================
  // BOTÕES DO NARRADOR
  // ===================================================
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
      usuario_id: currentUser?.id
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

      {/* ===== NARRADOR ===== */}
      <div className={styles.narratorSection}>
        {etapa && (
          <Narrador
            etapa={etapa}
            usuario={currentUser}
            repeatTrigger={repeatTrigger}
            skipSignal={skipSignal}
            onFalaReady={setCurrentFala}
          />
        )}
      </div>

      {/* ===== INPUT DO USUÁRIO ===== */}
      <input
        className={styles.responseInput}
        type="text"
        placeholder="Digite sua resposta..."
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
      />

      {/* ===== CONTROLES ===== */}
      <NarratorControls
        onSkip={handleSkip}
        onRepeat={handleRepeat}
        onHint={handleHint}
        onSend={handleSend}
      />

      {hint && <p className={styles.hintBox}>💡 {hint}</p>}

      {/* ===== BOTÕES DOS LABS ===== */}
      <div className={styles.labs}>

        <button
          onClick={() => setEtapa("lab01_intro")}
          disabled={!lab1Liberado}
          className={!lab1Liberado ? styles.locked : ""}
        >
          Lab-01
        </button>

        <button
          onClick={() => setEtapa("lab02_intro")}
          disabled={!lab2Liberado}
          className={!lab2Liberado ? styles.locked : ""}
        >
          Lab-02
        </button>

      </div>

    </div>
  );
}

export default HomePage;
