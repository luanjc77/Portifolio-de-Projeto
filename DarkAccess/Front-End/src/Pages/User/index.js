import React, { useEffect, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import styles from './User.module.css';

function UserPage() {
  const [user, setUser] = useState(null);
  const [editingPassword, setEditingPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [playerLife, setPlayerLife] = useState(100);
  const [conquistas, setConquistas] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      loadUserData(parsed.id);
    }
  }, []);

  async function loadUserData(id) {
    try {
      const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
      const API_PORT = process.env.REACT_APP_API_PORT || '3001';
      const base = process.env.REACT_APP_API_BASE || `http://${API_HOST}:${API_PORT}`;

      const res = await fetch(`${base}/api/auth/user/${id}`);
      const data = await res.json();

      if (data.success) {
        const userData = data.user;
        
        console.log('✅ Dados do usuário recebidos:', userData);
        console.log('🏆 Conquistas recebidas:', userData.conquistas);
        
        setUser(userData);
        setForm({
          username: userData.username || '',
          email: userData.email || ''
        });
        
        if (userData.avatar) setAvatar(userData.avatar);
        setPlayerLife(userData.vidas || 3);
        
        // Carregar conquistas
        if (userData.conquistas && userData.conquistas.length > 0) {
          console.log('📝 Setando conquistas:', userData.conquistas);
          setConquistas(userData.conquistas);
        } else {
          console.log('⚠️ Nenhuma conquista encontrada');
          setConquistas([]);
        }
        
        // Atualizar localStorage com dados frescos
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      
      // Fallback: usar dados do localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({
          username: parsed.username || '',
          email: parsed.email || ''
        });
        if (parsed.avatar) setAvatar(parsed.avatar);
        setPlayerLife(parsed.vidas || 3);
      }
    }
  }

  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFile = () => fileInputRef.current && fileInputRef.current.click();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...(user || {}), ...form, avatar, playerLife };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    alert('Informações salvas localmente.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.avatarColumn}>
          <div className={styles.avatarRing} style={{ '--life': `${playerLife}%` }}>
            <img
              src={avatar || '/caverinha.ico'}
              alt="avatar"
              className={styles.avatar}
            />
            <button className={styles.editButton} onClick={triggerFile} aria-label="Editar imagem">
              <FaPen />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
          </div>
          <div className={styles.lifeLabel}>{playerLife}%</div>
        </div>

        <div className={styles.achievements}>
          <h3>Conquistas / Acessos</h3>
          <div className={styles.achievementsGrid}>
            {conquistas.length === 0 && <div className={styles.badge}>Nenhuma conquista ainda</div>}

            {conquistas.map((c, index) => (
              <div key={index} className={styles.badge}>
                {c.nome}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSave}>
        <h2>Informações do Usuário</h2>
        <label className={styles.label}>
          Nome de usuário
          <input name="username" value={form.username} onChange={handleChange} className={styles.input} />
        </label>

        <label className={styles.label}>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} />
        </label>

        <div className={styles.passwordRow}>
          <button type="button" className={styles.passwordToggle} onClick={() => setEditingPassword(p => !p)}>
            {editingPassword ? 'Cancelar redefinição' : 'Redefinir senha'}
          </button>
          {editingPassword && (
            <input placeholder="Nova senha" type="password" className={styles.input} />
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default UserPage;
