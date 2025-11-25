import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = process.env.REACT_APP_API_URL || `http://${API_HOST}:${API_PORT}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Salvar usuário no localStorage com dados completos
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Usuário cadastrado com sucesso!');
        navigate('/inicio');
      } else {
        alert(`Erro no cadastro: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>CRIAR CONTA</h1>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          CADASTRAR
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;