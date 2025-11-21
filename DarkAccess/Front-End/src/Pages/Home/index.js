import React, { useState, useRef } from "react";
import styles from "./HomePage.module.css";
import Narrator from "../../components/Narrator";
import User from "../../components/User";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = process.env.REACT_APP_API_URL || `http://${API_HOST}:${API_PORT}`;

  const [activeChallenges, setActiveChallenges] = useState([]);
  const [playerLife, setPlayerLife] = useState(100);
  const [hint, setHint] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [currentFala, setCurrentFala] = useState(null);
  const [lastMessage, setLastMessage] = useState("Olá, explorador. Prepare-se para desvendar os segredos da rede DALL·E...");
  const [repeatTrigger, setRepeatTrigger] = useState(0); // 🔹 força re-render apenas quando repete
  const lastMessageRef = useRef(lastMessage);
  const navigate = useNavigate();


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
      const response = await fetch(`${API_URL}/api/narrador/dica/${currentFala.etapa}`);
      const data = await response.json();
      if (data && data.dica) setHint(data.dica);
      else setHint('Nenhuma dica disponível agora...');
    } catch (error) {
      console.error('Erro ao buscar dica:', error);
      setHint('Erro ao conectar com o narrador.');
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
      const resp = await fetch(`${API_URL}/api/narrador/resposta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (data && data.mensagem) alert(data.mensagem);
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
      alert('Erro ao enviar resposta.');
    }
    setUserResponse("");
  };

  const handleStartChallenge = async (challengeId) => {
    console.log(`Iniciando requisição para o desafio: ${challengeId}`);
    try {
      const response = await fetch(`${API_URL}/api/challenges/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });
      if (!response.ok) throw new Error('Falha na resposta da API');

      const data = await response.json();
      if (data.success && data.sessionId) {
        const proxyUrl = `${API_URL}/challenge/${data.sessionId}`;
        window.open(proxyUrl, '_blank', 'noopener,noreferrer');
        setActiveChallenges(prev => [...prev, { id: data.sessionId, name: challengeId }]);
      } else {
        alert('Não foi possível obter a sessão para o desafio.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor.');
    }
  };

  const handleStopChallenge = async (sessionId) => {
    console.log(`Iniciando encerramento para a sessão: ${sessionId}`);
    try {
      const response = await fetch(`${API_URL}/api/challenges/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (!response.ok) throw new Error('Falha na resposta da API');

      const data = await response.json();
      if (data.success) {
        setActiveChallenges(prev => prev.filter(challenge => challenge.id !== sessionId));
        alert('Ambiente do desafio encerrado com sucesso!');
      } else {
        alert('Não foi possível encerrar o desafio.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor para encerrar o desafio.');
    }
  };

  return (
    <div className={styles.homeContainer}>
      <Narrator messages={[lastMessageRef.current]} repeatTrigger={repeatTrigger} onFalaReady={(f) => setCurrentFala(f)} />

        <User playerLife={playerLife} onClick={() => navigate('/user')} />

      {/* Caixa do narrador interativa */}
      <div className={styles.narratorBox}>
        <input
          type="text"
          className={styles.responseInput}
          placeholder="Digite sua resposta aqui..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
        />
        <div className={styles.buttonRow}>
          <button onClick={handleSendResponse}>Enviar</button>
          <button onClick={handleRepeat}>Repetir Fala</button>
          <button onClick={handleHint}>Dica</button>
        </div>
        {hint && <p className={styles.hintBox}>💡 {hint}</p>}
      </div>

      <main className={styles.challengeGrid}>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('xss')}>Lab-01</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('so')}>Lab-02</button>
      </main>

      {activeChallenges.length > 0 && (
        <section className={styles.activeChallenges}>
          <h3>Ambientes Ativos</h3>
          <ul>
            {activeChallenges.map(challenge => (
              <li key={challenge.id}>
                <span>{challenge.name} (ID: {challenge.id.substring(0, 8)})</span>
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
