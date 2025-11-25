import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';

import Narrador from '../../components/Narrator';
import User from '../../components/User';
import NarratorControls from '../../components/NarratorControls';

function StartPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const [skipSignal, setSkipSignal] = useState(0);
  const [repeatTrigger, setRepeatTrigger] = useState(0);

  const [etapa, setEtapa] = useState("inicio_primeiro_acesso");
  const [botoesBloqueados, setBotoesBloqueados] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setCurrentUser(u);

      if (u.primeiro_acesso === true) {
        setEtapa("inicio_primeiro_acesso");
        setBotoesBloqueados(true);
      } else {
        setEtapa("inicio_pos_primeiro_acesso");
        setBotoesBloqueados(false);
      }
    }
  }, []);

  const handleSkip = () => setSkipSignal(p => p + 1);
  const handleRepeat = () => setRepeatTrigger(p => p + 1);

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* Botões do narrador */}
        <div className={styles.topLeft}>
          <NarratorControls
            onSkip={handleSkip}
            onRepeat={handleRepeat}
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
            etapa={etapa}
            usuario={currentUser}
            skipSignal={skipSignal}
            repeatTrigger={repeatTrigger}
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
