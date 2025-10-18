import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import Narrator from '../../components/Narrator';

function WelcomePage() {
  const navigate = useNavigate();
  const handleNavigateToRegister = () => {
    navigate('/register');
  };
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Narrator messages={["Olá Explorador!", "Identifique-se primeiramente..."]} className={styles.narrator} />
        <div className={styles.buttonGroup}>
          <button className={styles.startButton} onClick={handleNavigateToLogin}>
            LOGIN
          </button>
          <button className={styles.startButton} onClick={handleNavigateToRegister}>
            CADASTRO
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;