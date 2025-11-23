import React, { useState, useRef } from "react";
import styles from "./HomePage.module.css";
import Narrator from "../../components/Narrator";
import User from "../../components/User";
import NarratorControls from "../../components/NarratorControls";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = `http://${API_HOST}:${API_PORT}`;

  const [activeChallenges, setActiveChallenges] = useState([]);
  const [playerLife, setPlayerLife] = useState(100);

  const [hint, setHint] = useState("");
  const [userResponse, setUserResponse] = useState("");

  const [currentFala, setCurrentFala] = useState(null);
  const [lastMessage] = useState("Olá, explorador. Prepare-se para desvendar os segredos da rede DALL·E...");
  const [repeatTrigger, setRepeatTrigger] = useState(0);

  const lastMessageRef = useRef(lastMessage);
  const navigate = useNavigate();

  // ========== BOTÕES DO NARRADOR ==========

  const handleRepeat = () => {
    setHint("");
    setRepeatTrigger(t => t + 1);
  };

  const handleHint = async () => {
    try {
      if (!currentFala || !currentFala.etapa) {
        setHint('Nenhuma dica disponível agora.');
        return;
      }
      const res = await fetch(`${API_URL}/api/narrador/dica/${currentFala.etapa}`);
      const data = await res.json();
      setHint(data?.dica || 'Nenhuma dica disponível...');
    } catch (err) {
      setHint('Erro ao buscar dica.');
    }
  };

  const handleSendResponse = async () => {
    if (!userResponse.trim()) return;

    try {
      const payload = {
        etapa: currentFala?.etapa || 'inicio',
        resposta: userResponse,
        usuario_id: null,
      };

      const res = await fetch(`${API_URL}/api/narrador/resposta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data?.mensagem || 'Resposta enviada!');
    } catch (err) {
      alert('Erro ao enviar resposta.');
    }

    setUserResponse("");
  };

  // ========== DESAFIOS ==========

  const handleStartChallenge = async (challengeId) => {
    try {
      const response = await fetch(`${API_URL}/api/challenges/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });

      const data = await response.json();
      if (data.success && data.sessionId) {
        const proxyUrl = `${API_URL}/challenge/${data.sessionId}`;
        window.open(proxyUrl, "_blank", "noopener,noreferrer");

        setActiveChallenges(prev => [...prev, { id: data.sessionId, name: challengeId }]);
      } else {
        alert("Erro ao iniciar ambiente.");
      }
    } catch {
      alert("Erro ao conectar ao servidor.");
    }
  };

  const handleStopChallenge = async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/api/challenges/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (data.success) {
        setActiveChallenges(prev => prev.filter(c => c.id !== sessionId));
      } else {
        alert("Erro ao encerrar ambiente.");
      }
    } catch {
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className={styles.homeContainer}>

      {/* NARRADOR */}
      <Narrator
        messages={[lastMessageRef.current]}
        repeatTrigger={repeatTrigger}
        onFalaReady={f => setCurrentFala(f)}
      />

      {/* AVATAR */}
      <User playerLife={playerLife} onClick={() => navigate('/user')} />

      {/* CONTROLES DO NARRADOR */}
      <NarratorControls
        showInput
        responseValue={userResponse}
        onChangeResponse={setUserResponse}
        onSend={handleSendResponse}
        onRepeat={handleRepeat}
        onHint={handleHint}
        onSkip={() => setRepeatTrigger(t => t + 1)}
      />

      {/* DICA */}
      {hint && <p className={styles.hintBox}>💡 {hint}</p>}

      {/* BOTÕES DOS LABS */}
      <main className={styles.challengeGrid}>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('xss')}>
          Lab-01
        </button>

        <button className={styles.challengeButton} onClick={() => handleStartChallenge('so')}>
          Lab-02
        </button>
      </main>

      {/* SESSÕES ATIVAS */}
      {activeChallenges.length > 0 && (
        <section className={styles.activeChallenges}>
          <h3>Ambientes Ativos</h3>
          <ul>
            {activeChallenges.map(challenge => (
              <li key={challenge.id}>
                <span>{challenge.name} — {challenge.id.substring(0, 8)}</span>
                <button onClick={() => handleStopChallenge(challenge.id)}>Encerrar</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default HomePage;
