import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import Narrador from '../../components/Narrator';
import axios from 'axios';


function WelcomePage() {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('Boas-vindas ao mundo, viajante... Identifique-se para acessar os portais da rede DALL·E.');
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  useEffect(() => {
    // Busca a fala inicial do narrador
    const API_HOST2 = process.env.REACT_APP_API_HOST || window.location.hostname;
    const API_PORT2 = process.env.REACT_APP_API_PORT || (window.location.port ? window.location.port : '3001');
    const base = process.env.REACT_APP_API_BASE || `http://${API_HOST2}:${API_PORT2}`;

    axios.get(`${base}/api/narrador/fala/inicio`)
      .then((res) => {
        if (res.data.success) setMensagem(res.data.fala.fala);
        else setMensagem('Sistema de comunicação instável...');
      })
      .catch((error) => {
        console.error('Erro ao buscar fala do narrador:', error);
        setMensagem('Falha ao conectar ao narrador...');
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Narrador messages={[mensagem]} className={styles.narrator} />
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
