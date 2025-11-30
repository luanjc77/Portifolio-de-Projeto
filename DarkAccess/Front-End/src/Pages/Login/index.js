import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('pinguin');
  const [password, setPassword] = useState('123');

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = process.env.REACT_APP_API_URL || `http://${API_HOST}:${API_PORT}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Buscar dados completos do usuário
        const userResponse = await fetch(`${API_URL}/api/auth/user/${data.user.id}`);
        const userData = await userResponse.json();
        
        if (userData.success) {
          localStorage.setItem('user', JSON.stringify(userData.user));
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        navigate('/inicio');
      } else {
        alert(`Erro no login: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>LOGIN</h1>
        <input
          type="text"
          placeholder="Username ou Email"
          className={styles.input}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          ENTRAR
        </button>
      </form>
    </div>
  );
}

export default LoginPage;