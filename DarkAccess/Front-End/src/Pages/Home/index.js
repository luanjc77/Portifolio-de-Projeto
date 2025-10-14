import React, { useState } from "react";
import styles from "./HomePage.module.css";
import Narrator from "../../components/Narrator";

function HomePage() {
    const API_URL = 'tiddly-marge-morbifically.ngrok-free.dev'; // SUBSTITUA PELO SEU IP PÚBLICO
    const [activeChallenges, setActiveChallenges] = useState([]);
    const narratorMessages = [
        "Olá, explorador.",
        "Vejo que você tem curiosidade...",
        "Existem segredos escondidos nesta rede.",
        "Você tem o que é preciso para encontrá-los?",
        "Comece sua jornada abaixo."
    ];

    const handleStartChallenge = async (challengeId) => {
        console.log(`Iniciando requisição para o desafio: ${challengeId}`);
        try {
            const response = await fetch(`${API_URL}/api/challenges/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challengeId }),
            });
            if (!response.ok) throw new Error('Falha na resposta da API');

            const data = await response.json();
            if (data.success && data.sessionId) {
                const proxyUrl = `${API_URL}/challenge/${data.sessionId}`;
                window.open(proxyUrl, '_blank', 'noopener,noreferrer');
                setActiveChallenges(prev => [...prev, { id: data.sessionId, name: challengeId }]);
            } else {
                alert('Não foi possível obter a sessão para o desafio.');
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
            alert('Não foi possível conectar com o servidor.');
        }
    };

    const handleStopChallenge = async (sessionId) => {
        console.log(`Iniciando encerramento para a sessão: ${sessionId}`);
        try {
            const response = await fetch(`${API_URL}/api/challenges/stop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
            if (!response.ok) throw new Error('Falha na resposta da API');

            const data = await response.json();
            if (data.success) {
                setActiveChallenges(prev => prev.filter(challenge => challenge.id !== sessionId));
                alert('Ambiente do desafio encerrado com sucesso!');
            } else {
                alert('Não foi possível encerrar o desafio.');
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
            alert('Não foi possível conectar com o servidor para encerrar o desafio.');
        }
    };

    return (
        <div className={styles.homeContainer}>
            <Narrator messages={narratorMessages} />

            <header className={styles.header}>
                <h1>DarkAccess</h1>
                <h2>Selecione o tema que deseja explorar:</h2>
            </header>

            <main className={styles.challengeGrid}>
                <button className={styles.challengeButton} onClick={() => handleStartChallenge('phishing')}>Phishing</button>
                <button className={styles.challengeButton} onClick={() => handleStartChallenge('keylogger')}>Keylogger</button>
                {/* Outros botões podem ser adicionados aqui */}
            </main>

            {activeChallenges.length > 0 && (
                <section className={styles.activeChallenges}>
                    <h3>Ambientes Ativos</h3>
                    <ul>
                        {activeChallenges.map(challenge => (
                            <li key={challenge.id}>
                                <span>{challenge.name} (ID: {challenge.id.substring(0, 8)})</span>
                                <button onClick={() => handleStopChallenge(challenge.id)}>Encerrar</button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default HomePage;