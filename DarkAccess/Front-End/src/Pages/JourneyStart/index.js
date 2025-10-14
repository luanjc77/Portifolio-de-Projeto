import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JourneyStart.module.css';

function JourneyStartPage() {
  const navigate = useNavigate();
  const handleNavigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>INICIAR JORNADA</h1>
        <p className={styles.description}>
          Sua jornada está prestes a começar. Escolha seu caminho.
          A Surface Web irá te guiar e preparar. A Deep Web é um território
          desconhecido, onde você estará por conta própria.
        </p>
        <div className={styles.pathGroup}>
          <button className={styles.pathButton} onClick={handleNavigateToHome}>
            SURFACE WEB
          </button>
          <button className={`${styles.pathButton} ${styles.locked}`}>
            DEEP WEB
          </button>
        </div>
      </div>
    </div>
  );
}

export default JourneyStartPage;