import React from "react";
import styles from "./HomePage.module.css";

function HomePage() {
  // URL da sua API. Lembre-se de usar o IP público da sua VM AWS.
  const API_URL = 'http://56.125.173.127:3001';

  // Esta função agora chama a API para obter um sessionId e abre a URL do proxy
  const handleStartChallenge = async (challengeId) => {
    console.log(`Iniciando requisição para o desafio: ${challengeId}`);

    try {
      // Fazendo a requisição POST para a nossa API
      const response = await fetch(`${API_URL}/api/challenges/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId: challengeId }), // Enviando o ID do desafio
      });

      // Verificando se a resposta da API foi bem-sucedida
      if (!response.ok) {
        throw new Error('Falha ao iniciar o desafio. O servidor respondeu com um erro.');
      }

      // Extraindo os dados (o JSON) da resposta
      const data = await response.json();

      // Verificando se recebemos um sessionId válido
      if (data.success && data.sessionId) {
        console.log(`Sessão recebida do backend: ${data.sessionId}`);
        
        // Monta a URL do proxy usando o sessionId
        const proxyUrl = `${API_URL}/challenge/${data.sessionId}`;
        
        console.log(`Abrindo URL do proxy: ${proxyUrl}`);
        
        // Abre a URL do proxy em uma nova aba
        window.open(proxyUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.error('A resposta da API não continha um sessionId válido.');
        alert('Não foi possível obter a sessão para o desafio.');
      }

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor. Verifique se a API está rodando.');
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>DarkAccess</h1>
        <h2>Selecione o tema que deseja explorar:</h2>
      </header>

      <main className={styles.challengeGrid}>
        {/* O botão "Phishing" agora chama a nossa nova função */}
        <button 
          className={styles.challengeButton}
          onClick={() => handleStartChallenge('phishing')}
        >
          Phishing
        </button>

        {/* Os botões abaixo são placeholders por enquanto */}
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('keylogger')}>Keylogger</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('ransomware')}>Ransomware</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('brute-force')}>Brute Force</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('sql-injection')}>SQL Injection</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('social-engineering')}>Engenharia Social</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('redes')}>Redes</button>
        <button className={styles.challengeButton} onClick={() => handleStartChallenge('criptografia')}>Criptografia</button>
      </main>
    </div>
  );
}

export default HomePage;