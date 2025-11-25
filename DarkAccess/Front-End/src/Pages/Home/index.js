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
      
      // Buscar dados completos do usuário
      fetch(`${API_URL}/api/auth/user/${json.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCurrentUser(data.user);
            setPlayerLife(data.user.vidas ?? 3);
            
            // SEMPRE usa etapa_atual do banco
            const etapa = data.user.etapa_atual || 'inicio_primeiro_acesso';
            setCurrentEtapa(etapa);
          }
        })
        .catch(err => {
          console.error("Erro ao carregar usuário:", err);
          setCurrentUser(json);
          setPlayerLife(json.vida ?? 100);
          const etapa = json.etapa_atual || 'inicio_primeiro_acesso';
          setCurrentEtapa(etapa);
        });
    }
  }, [API_URL]);

  const handleSkip = () => setSkipSignal((s) => s + 1);
  const handleRepeat = () => setRepeatTrigger((r) => r + 1);
  
  const handleNext = async () => {
    if (!currentUser?.id) return;
    
    const novaEtapa = await avancarEtapa(currentUser);
    if (novaEtapa) {
      const userAtualizado = {...currentUser, etapa_atual: novaEtapa, primeiro_acesso: false};
      setCurrentUser(userAtualizado);
      setCurrentEtapa(novaEtapa);
      localStorage.setItem('user', JSON.stringify(userAtualizado));
    }
  };

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

  // Determinar se deve mostrar botão "Próximo" ou campo de resposta
  const mostrarBotaoProximo = currentFala && !currentFala.resposta_correta;

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

      {/* ===== INPUT DE RESPOSTA (só aparece se for pergunta) ===== */}
      {!mostrarBotaoProximo && (
        <input
          className={styles.responseInput}
          type="text"
          placeholder="Digite sua resposta..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
        />
      )}

      {/* ===== CONTROLES DO NARRADOR ===== */}
      <NarratorControls
        onSkip={handleSkip}
        onRepeat={handleRepeat}
        onHint={handleHint}
        onSend={mostrarBotaoProximo ? handleNext : handleSend}
        showNext={mostrarBotaoProximo}
      />

      {hint && <p className={styles.hintBox}>💡 {hint}</p>}

      {/* ===== BOTÕES DOS LABS ===== */}
      <div className={styles.labs}>
        {/* LAB01 — sempre liberado */}
        <button onClick={async () => {
          // Atualizar etapa primeiro
          const sucesso = await atualizarEtapa(currentUser.id, "lab01_intro");
          if (sucesso) {
            setCurrentEtapa("lab01_intro");
            setCurrentUser({...currentUser, etapa_atual: "lab01_intro"});
          }
          
          // Iniciar container do lab
          try {
            const response = await fetch(`${API_URL}/api/docker/start-lab`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuario_id: currentUser.id,
                lab_id: "lab01"
              })
            });
            
            const data = await response.json();
            if (data.success) {
              // Abrir lab em nova aba
              window.open(data.url, "_blank");
            } else {
              alert("Erro ao iniciar Lab01: " + data.message);
            }
          } catch (err) {
            console.error("Erro ao iniciar lab:", err);
            alert("Erro ao conectar com o servidor");
          }
        }}>Lab-01</button>

        {/* LAB02 — bloqueia se usuário não terminou Lab01 */}
        <button
          disabled={!hasLab01Conquista}
          className={!hasLab01Conquista ? styles.locked : ""}
          onClick={async () => {
            // Atualizar etapa primeiro
            const sucesso = await atualizarEtapa(currentUser.id, "lab02_intro");
            if (sucesso) {
              setCurrentEtapa("lab02_intro");
              setCurrentUser({...currentUser, etapa_atual: "lab02_intro"});
            }
            
            // Iniciar container do lab
            try {
              const response = await fetch(`${API_URL}/api/docker/start-lab`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  usuario_id: currentUser.id,
                  lab_id: "lab02"
                })
              });
              
              const data = await response.json();
              if (data.success) {
                // Abrir lab em nova aba
                window.open(data.url, "_blank");
              } else {
                alert("Erro ao iniciar Lab02: " + data.message);
              }
            } catch (err) {
              console.error("Erro ao iniciar lab:", err);
              alert("Erro ao conectar com o servidor");
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
