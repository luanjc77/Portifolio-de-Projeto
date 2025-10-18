import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import styles from './User.module.css';

function User({ playerLife = 100, onClick }) {
  return (
    <div
      className={styles.playerLifeCircle}
      style={{ '--life-percentage': `${playerLife}%` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
    >
      <div className={styles.lifeBar}></div>
      <FaUserCircle className={styles.icon} />
    </div>
  );
}

export default User;
