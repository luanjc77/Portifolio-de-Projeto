import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import Narrador from '../../components/Narrator';
import User from '../../components/User';

const playerLife = 100;

function StartPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [password, setPassword] = useState('');
  const [isDeepWebUnlocked, setIsDeepWebUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [narratorTrigger, setNarratorTrigger] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUser(parsed);
      if (parsed.deepweb_access === 'S') {
        setIsDeepWebUnlocked(true);
      }
    }

    const deepWebUnlocked = localStorage.getItem('deepWebUnlocked');
    if (deepWebUnlocked === 'true') {
      setIsDeepWebUnlocked(true);
    }
  }, []);

  // --- Unlock Profundezas via BACKEND ---
  async function unlockDeepWeb(passwordValue) {
    try {
      const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
      const API_PORT = process.env.REACT_APP_API_PORT || '3001';
      const base = process.env.REACT_APP_API_BASE || `http://${API_HOST}:${API_PORT}`;

      const response = await fetch(`${base}/api/deepweb/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          password: passwordValue
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsDeepWebUnlocked(true);
        setShowError(false);

        const updatedUser = { ...currentUser, deepweb_access: 'S' };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('deepWebUnlocked', 'true');

        alert(data.narrador_fala);
        setNarratorTrigger(narratorTrigger + 1);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Erro ao desbloquear Deep Web:', error);
    }
  }

  // Campo da senha
  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassword(value);
    if (value.length >= 3) {
      unlockDeepWeb(value);
    } else {
      setShowError(false);
    }
  }

  const handleNavigateToDeepWeb = () => {
    if (isDeepWebUnlocked) navigate('/deep-web');
  };

  const handleNavigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <User playerLife={playerLife} onClick={() => navigate('/user')} />

        <div className={styles.narratorWrapper}>
          <Narrador 
            etapa="inicio" 
            usuario={currentUser}
            repeatTrigger={narratorTrigger}
          />
        </div>

        <div className={styles.pathGroup}>
          <button className={styles.pathButton} onClick={handleNavigateToHome}>
            SUPERFÍCIE
          </button>

          <div className={styles.deepWebSection}>
            <input
              type="password"
              placeholder="Digite a senha para desbloquear"
              value={password}
              onChange={handlePasswordChange}
              className={styles.passwordInput}
            />

            {showError && (
              <p className={styles.errorMessage}>Senha incorreta. Tente novamente.</p>
            )}

            <button
              className={`${styles.pathButton} ${!isDeepWebUnlocked ? styles.locked : styles.unlocked}`}
              onClick={handleNavigateToDeepWeb}
              disabled={!isDeepWebUnlocked}
            >
              PROFUNDEZAS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
