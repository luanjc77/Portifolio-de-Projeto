import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import styles from './User.module.css';

export default function User({ life, onClick }) {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      
      {/* CÍRCULO DINÂMICO */}
      <div 
        className={styles.lifeCircle}
        style={{ '--life': `${life}%` }}
      ></div>

      {/* AVATAR */}
      <div className={styles.avatar}>
        <FaUserCircle />
      </div>

    </div>
  );
}
