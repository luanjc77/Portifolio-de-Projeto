import React from "react";
import styles from "./HomePage.module.css";

function HomePage() {
  const phishingChallengeUrl = 'http://167.234.249.117:8080/';

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>DarkAccess</h1>
        <h2>Selecione o tema que deseja explorar:</h2>
      </header>

      <main className={styles.challengeGrid}>
        {/* Este é um link funcional que se parece com um botão */}
        <a 
          href={phishingChallengeUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.challengeButton}
        >
          Phishing
        </a>

        {/* Os botões abaixo são placeholders por enquanto */}
        <button className={styles.challengeButton}>Keylogger</button>
        <button className={styles.challengeButton}>Ransomware</button>
        <button className={styles.challengeButton}>Brute Force</button>
        <button className={styles.challengeButton}>SQL Injection</button>
        <button className={styles.challengeButton}>Engenharia Social</button>
        <button className={styles.challengeButton}>Redes</button>
        <button className={styles.challengeButton}>Criptografia</button>
      </main>
    </div>
  );
}

export default HomePage;