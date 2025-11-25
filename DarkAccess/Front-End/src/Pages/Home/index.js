import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";

import Narrador from "../../components/Narrator";
import User from "../../components/User";
import NarratorControls from "../../components/NarratorControls";

import { useNavigate } from "react-router-dom";
import { avancarEtapa, atualizarEtapa } from "../../utils/progressao";

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

  const [currentEtapa, setCurrentEtapa] = useState(null);

  const hasLab01Conquista = currentUser?.conquistas?.some(
    (c) => c.codigo === "lab01_concluido"
  );

  // Carregar usuário completo do backend
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const json = JSON.parse(u);
      console.log("📦 User do localStorage:", json);
      
      // Buscar dados completos do usuário
      fetch(`${API_URL}/api/auth/user/${json.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log("✅ User do backend:", data.user);
            setCurrentUser(data.user);
            setPlayerLife(data.user.vidas ?? 3);
            
            // SEMPRE usa etapa_atual do banco
            const etapa = data.user.etapa_atual || 'inicio_primeiro_acesso';
            console.log("🎯 Etapa definida:", etapa);
            setCurrentEtapa(etapa);
          }
        })
        .catch(err => {
          console.error("❌ Erro ao carregar usuário:", err);
          setCurrentUser(json);
          setPlayerLife(json.vida ?? 100);
          const etapa = json.etapa_atual || 'inicio_primeiro_acesso';
          console.log("🎯 Etapa definida (fallback):", etapa);
          setCurrentEtapa(etapa);
        });
    }
  }, [API_URL]);

  const handleSkip = () => setSkipSignal((s) => s + 1);
  const handleRepeat = () => setRepeatTrigger((r) => r + 1);

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
      usuario_id: currentUser?.id || null,
    };

    const res = await fetch(`${API_URL}/api/narrador/resposta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data?.mensagem || "Resposta enviada.");

    setUserResponse("");
    
    // Se acertou, atualizar progresso
    if (data.correta) {
      const novaEtapa = await avancarEtapa(currentUser);
      if (novaEtapa) {
        const userAtualizado = {...currentUser, etapa_atual: novaEtapa, primeiro_acesso: false};
        setCurrentUser(userAtualizado);
        setCurrentEtapa(novaEtapa);
        
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(userAtualizado));
      }
    }
  };

  // Avançar automaticamente para etapas sem pergunta após a fala terminar
  useEffect(() => {
    if (!currentFala?.etapa || !currentUser?.id) return;
    
    console.log("🔍 Verificando avanço automático para:", currentFala.etapa);
    
    // Etapas que devem avançar automaticamente (sem pergunta)
    const etapasSemPergunta = [
      'explicacao_surface_deep_dark',
      'lab01_intro',
      'lab02_intro',
      'antes_acesso_profundezas',
      'phishing_armadilha_aurora'
    ];

    // Só avança se NÃO tiver resposta_correta (não é pergunta)
    if (etapasSemPergunta.includes(currentFala.etapa) && !currentFala.resposta_correta) {
      console.log("⏳ Aguardando 3 segundos para avançar...");
      // Aguardar 3 segundos após a fala terminar
      const timer = setTimeout(async () => {
        console.log("🚀 Avançando etapa automaticamente...");
        const novaEtapa = await avancarEtapa(currentUser);
        if (novaEtapa) {
          console.log("✅ Nova etapa:", novaEtapa);
          const userAtualizado = {...currentUser, etapa_atual: novaEtapa, primeiro_acesso: false};
          setCurrentUser(userAtualizado);
          setCurrentEtapa(novaEtapa);
          localStorage.setItem('user', JSON.stringify(userAtualizado));
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFala]);

  return (
    <div className={styles.page}>
      {/* ===== ÍCONE DO USUÁRIO ===== */}
      <div className={styles.topRight}>
        <User playerLife={playerLife} onClick={() => navigate("/user")} />
      </div>

      {/* ===== CAIXA DO NARRADOR ===== */}
      <div className={styles.narratorSection}>
        {currentEtapa && (
          <Narrador
            etapa={currentEtapa}
            usuario={currentUser}
            repeatTrigger={repeatTrigger}
            skipSignal={skipSignal}
            onFalaReady={setCurrentFala}
          />
        )}
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
        {/* LAB01 — sempre liberado */}
        <button onClick={async () => {
          const sucesso = await atualizarEtapa(currentUser.id, "lab01_intro");
          if (sucesso) {
            setCurrentEtapa("lab01_intro");
            setCurrentUser({...currentUser, etapa_atual: "lab01_intro"});
          }
        }}>Lab-01</button>

        {/* LAB02 — bloqueia se usuário não terminou Lab01 */}
        <button
          disabled={!hasLab01Conquista}
          className={!hasLab01Conquista ? styles.locked : ""}
          onClick={async () => {
            const sucesso = await atualizarEtapa(currentUser.id, "lab02_intro");
            if (sucesso) {
              setCurrentEtapa("lab02_intro");
              setCurrentUser({...currentUser, etapa_atual: "lab02_intro"});
            }
          }}
        >
          Lab-02
        </button>
      </div>
    </div>
  );
}

export default HomePage;
