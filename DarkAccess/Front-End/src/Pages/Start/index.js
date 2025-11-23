import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import Narrador from '../../components/Narrator';
import User from '../../components/User';

const playerLife = 100;

function StartPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleNavigateToHome = () => navigate('/home');
  const handleNavigateToDeepWebAccess = () => navigate('/darkaccess');

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* Avatar do usuário */}
        <User playerLife={playerLife} onClick={() => navigate('/user')} />

        {/* NARRADOR */}
        <div className={styles.narratorWrapper}>
          <Narrador etapa="inicio" usuario={currentUser} />
        </div>

        {/* BOTÕES LADO A LADO */}
        <div className={styles.buttonRow}>
          <button className={styles.pathButton} onClick={handleNavigateToHome}>
            SUPERFÍCIE
          </button>

          <button
            className={`${styles.pathButton} ${styles.unlocked}`}
            onClick={handleNavigateToDeepWebAccess}
          >
            PROFUNDEZAS
          </button>
        </div>

      </div>
    </div>
  );
}

export default StartPage;
