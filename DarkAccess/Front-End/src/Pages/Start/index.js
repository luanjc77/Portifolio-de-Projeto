import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import Narrator from '../../components/Narrator';

function StartPage() {
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
          <button className={styles.startButton} onClick={handleNavigateToRegister}>
            CADASTRO
          </button>
          <button className={styles.startButton} onClick={handleNavigateToLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartPage;