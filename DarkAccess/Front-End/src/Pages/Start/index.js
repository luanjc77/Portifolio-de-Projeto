import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';

import Narrador from '../../components/Narrator';
import User from '../../components/User';
import NarratorControls from '../../components/NarratorControls';
import { atualizarEtapa, avancarEtapa } from '../../utils/progressao';

function StartPage() {
  const navigate = useNavigate();
  const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

  const [currentUser, setCurrentUser] = useState(null);

  const [skipSignal, setSkipSignal] = useState(0);
  const [repeatTrigger, setRepeatTrigger] = useState(0);

  const [etapa, setEtapa] = useState("inicio_primeiro_acesso");
  const [botoesBloqueados, setBotoesBloqueados] = useState(true);
  const [currentFala, setCurrentFala] = useState(null);
  
  // Determinar se deve mostrar botão "Próximo"
  const mostrarBotaoProximo = currentFala && !currentFala.resposta_correta;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      
      // Buscar dados atualizados do backend
      fetch(`${API_URL}/api/auth/user/${u.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const userAtualizado = data.user;
            setCurrentUser(userAtualizado);
            
            // Atualizar localStorage com dados do servidor
            localStorage.setItem('user', JSON.stringify(userAtualizado));
            
            // Determinar etapa correta
            let etapaCorreta;
            if (userAtualizado.etapa_atual) {
              etapaCorreta = userAtualizado.etapa_atual;
            } else if (userAtualizado.primeiro_acesso === true) {
              etapaCorreta = "inicio_primeiro_acesso";
            } else {
              etapaCorreta = "inicio_pos_primeiro_acesso";
            }
            
            setEtapa(etapaCorreta);
            
            // Desbloquear botões se não for primeiro acesso
            if (!userAtualizado.primeiro_acesso || etapaCorreta !== 'inicio_primeiro_acesso') {
              setBotoesBloqueados(false);
            } else {
              // Desbloquear após 10 segundos (tempo da fala inicial)
              setTimeout(() => setBotoesBloqueados(false), 10000);
            }
          }
        })
        .catch(err => {
          console.error("Erro ao carregar usuário:", err);
          // Fallback para dados locais
          setCurrentUser(u);
          const etapaLocal = u.etapa_atual || (u.primeiro_acesso ? "inicio_primeiro_acesso" : "inicio_pos_primeiro_acesso");
          setEtapa(etapaLocal);
          setBotoesBloqueados(false);
        });
    }
  }, [API_URL]);

  const handleSkip = () => setSkipSignal(p => p + 1);
  const handleRepeat = () => setRepeatTrigger(p => p + 1);
  
  const handleNext = async () => {
    if (!currentUser?.id) return;
    
    const novaEtapa = await avancarEtapa(currentUser);
    if (novaEtapa) {
      const userAtualizado = {...currentUser, etapa_atual: novaEtapa, primeiro_acesso: false};
      setCurrentUser(userAtualizado);
      setEtapa(novaEtapa);
      localStorage.setItem('user', JSON.stringify(userAtualizado));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* Botões do narrador */}
        <div className={styles.topLeft}>
          <NarratorControls
            onSkip={handleSkip}
            onRepeat={handleRepeat}
            onSend={mostrarBotaoProximo ? handleNext : null}
            showNext={mostrarBotaoProximo}
          />
        </div>

        {/* Avatar do usuário */}
        <User 
          playerLife={currentUser?.vida || 100}
          onClick={() => navigate('/user')}
        />

        {/* Narrador */}
        <div className={styles.narratorWrapper}>
          <Narrador
            telaAtual="start"
            etapa={etapa}
            usuario={currentUser}
            skipSignal={skipSignal}
            repeatTrigger={repeatTrigger}
            onFalaReady={setCurrentFala}
          />
        </div>

        {/* Botões Surface / Deep */}
        <div className={styles.buttonRow}>
          
          <button
            disabled={botoesBloqueados}
            className={`${styles.pathButton} ${botoesBloqueados ? styles.locked : ""}`}
            onClick={() => navigate('/home')}
          >
            SUPERFÍCIE
          </button>

          <button
            disabled={botoesBloqueados}
            className={`${styles.pathButton} ${styles.unlocked}`}
            onClick={() => navigate('/darkaccess')}
          >
            PROFUNDEZAS
          </button>

        </div>
      </div>
    </div>
  );
}

export default StartPage;
