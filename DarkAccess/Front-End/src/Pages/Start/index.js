import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import Narrator from '../../components/Narrator';
import User from '../../components/User';

const playerLife = 100; 

function StartPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [isDeepWebUnlocked, setIsDeepWebUnlocked] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    // Verificar se a Deep Web já foi desbloqueada anteriormente
    const deepWebUnlocked = localStorage.getItem('deepWebUnlocked');
    if (deepWebUnlocked === 'true') {
      setIsDeepWebUnlocked(true);
    }
  }, []);

  const testPassword = "123456";

  async function liberarDeepWebAccess(userId) {
    try {//ajustar isso que ainda não está funcionando
      const response = await fetch(`https://tiddly-marge-morbifically.ngrok-free.dev:3001/api/user/${userId}/deepweb-access`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        // Atualiza o estado/localStorage do usuário
        if (currentUser) {
          const updatedUser = { ...currentUser, deepweb_access: 'S' };
          setCurrentUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Erro ao liberar Deep Web:', error);
    }
  }

  const handlePasswordChange = async (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value === testPassword) {
      setIsDeepWebUnlocked(true);
      setShowError(false);
      localStorage.setItem('deepWebUnlocked', 'true');
      if (currentUser && currentUser.deepweb_access !== 'S') {
        await liberarDeepWebAccess(currentUser.id);
      }
    } else {
      setIsDeepWebUnlocked(false);
      setShowError(value.length > 0);
    }
  };

  const handleNavigateToDeepWeb = () => {
    if (isDeepWebUnlocked) {
      navigate('/deep-web');
    }
  };

  const handleNavigateToHome = () => {
    navigate('/home');
  };

  const narratorMessages = currentUser ? [
    `Olá, explorador ${currentUser.username}.`,
    "Vejo que você tem curiosidade...",
    "Existem segredos escondidos nesta rede.",
    "Você tem o que é preciso para encontrá-los?",
    "Comece sua jornada abaixo."
  ] : [];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
  <User playerLife={playerLife} onClick={() => navigate('/user')} />
        <Narrator messages={narratorMessages} className={styles.narrator} />
        <div className={styles.pathGroup}>
          <button className={styles.pathButton} onClick={handleNavigateToHome}>
            SURFACE WEB
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
              DEEP WEB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;