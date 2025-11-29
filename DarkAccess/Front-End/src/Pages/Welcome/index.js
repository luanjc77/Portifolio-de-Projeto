import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';


function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>Bem-Vindo Explorador! Identifique-se primeiramente</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.startButton} onClick={() => navigate('/login')}>
            LOGIN
          </button>
          <button className={styles.startButton} onClick={() => navigate('/register')}>
            CADASTRO
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
