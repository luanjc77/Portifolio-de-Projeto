import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DarkAccess.module.css';

export default function DarkAccess() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', ip: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // pre-fill username if logged
    const u = localStorage.getItem('user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setForm((f) => ({ ...f, username: parsed.username || '' }));
      } catch (e) {}
    }
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
      const API_PORT = process.env.REACT_APP_API_PORT || (window.location.port ? window.location.port : '3001');
      const base = process.env.REACT_APP_API_BASE || `http://${API_HOST}:${API_PORT}`;

      // include userId if available to speed lookup
      const stored = localStorage.getItem('user');
      const userObj = stored ? JSON.parse(stored) : null;
      const body = {
        username: form.username,
        password: form.password,
        ip: form.ip,
        userId: userObj ? userObj.id : undefined
      };

      const res = await fetch(`${base}/api/deepweb/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: 'error', text: data.message || 'Erro ao validar credenciais.' });
        setLoading(false);
        return;
      }

      // sucesso: atualiza localStorage com user retornado
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setMsg({ type: 'success', text: data.message || 'Acesso liberado.' });

      // redireciona para a área profunda (ou para onde preferir)
      setTimeout(() => navigate('/deep-web'), 1000);

    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>AVISO SOBRE VPN</h2>
        <p className={styles.lead}>
          Se não se conectar à mesma rede do DarkAccess, não terá acesso ao conteúdo indexado.
          Esta tela simula uma conexão VPN — insira credenciais e IP corretos para prosseguir.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Usuário
            <input name="username" value={form.username} onChange={handleChange} />
          </label>

          <label>
            Senha
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </label>

          <label>
            IP da rede
            <input name="ip" value={form.ip} onChange={handleChange} placeholder="xxx.xxx.xxx.xxx" />
          </label>

          <div className={styles.row}>
            <button type="submit" disabled={loading}>
              {loading ? 'Validando...' : 'Conectar'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className={styles.cancel}>Voltar</button>
          </div>

          {msg && (
            <div className={msg.type === 'error' ? styles.error : styles.success}>
              {msg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
