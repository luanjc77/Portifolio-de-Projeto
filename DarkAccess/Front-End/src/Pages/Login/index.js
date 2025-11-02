import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('pingu');
  const [password, setPassword] = useState('123');

  const API_URL = 'http://35.238.81.86:3001'; 

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
        //alert('Login bem-sucedido!');
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/inicio');
      } else {
        alert(`Erro no login: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar com o servidor.');
    }
  };
  // Google client ID (same used previously)
  const GOOGLE_CLIENT_ID = '1025285394107-heh9agp5nv5f3eo8ns0dfnjt4qnugeuq.apps.googleusercontent.com';
  const buttonRef = useRef(null);

  useEffect(() => {
    // Handler for the credential response (JWT)
    const handleCredentialResponse = (response) => {
      try {
        const jwt = response.credential; // JWT
        // decode base64url payload
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        console.log('Google payload:', payload);
        // store minimal user info and navigate
        localStorage.setItem('user', JSON.stringify(payload));
        navigate('/inicio');
      } catch (err) {
        console.error('Failed to parse Google credential', err);
      }
    };

    // Initialize Google Identity Services when available
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // Render the default Google button into our ref container
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large' });
      }
      // Optionally show prompt: window.google.accounts.id.prompt();
    } else {
      // If the script hasn't loaded yet, try to wait for it briefly
      const onLoad = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });
          if (buttonRef.current) {
            window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large' });
          }
        }
      };
      window.addEventListener('google-loaded', onLoad);
      // fallback: try once after a short delay
      const t = setTimeout(onLoad, 1000);
      return () => {
        clearTimeout(t);
        window.removeEventListener('google-loaded', onLoad);
      };
    }
    // no cleanup needed for google.accounts.id per se
  }, [navigate]);

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
        <div ref={buttonRef} style={{ marginTop: 12 }} />
      </form>
    </div>
  );
}

export default LoginPage;