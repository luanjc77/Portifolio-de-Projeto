import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

function WelcomePage() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login'); 
};

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>BEM-VINDO AO DARKACCESS</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleLogin}>
            LOGIN
          </button>
          <button className={`${styles.button} ${styles.secondary}`} onClick={handleRegister}>
            CADASTRO
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;