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

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleSkip = () => setSkipSignal((p) => p + 1);
  const handleRepeat = () => setRepeatTrigger((p) => p + 1);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Avatar + Botões do narrador */}
        <div className={styles.topLeft}>
          <NarratorControls
              onSkip={handleSkip}
              onRepeat={handleRepeat}
              etapa="inicio_novo"
          />
        </div>
        
          <User life={currentUser?.vida || 100} onClick={() => navigate('/user')} />

        {/* Texto do narrador */}
        <div className={styles.narratorWrapper}>
          <Narrador
            etapa="inicio_novo"
            usuario={currentUser}
            skipSignal={skipSignal}
            repeatTrigger={repeatTrigger}
          />
        </div>

        {/* Botões principais */}
        <div className={styles.buttonRow}>
          <button className={styles.pathButton} onClick={() => navigate('/home')}>
            SUPERFÍCIE
          </button>

          <button
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
