import React, { useEffect, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import styles from './User.module.css';

function UserPage() {
  const [user, setUser] = useState(null);
  const [editingPassword, setEditingPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    cardNumber: '',
    cvv: '',
    expiry: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [playerLife, setPlayerLife] = useState(100);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm(prev => ({
          ...prev,
          username: parsed.username || '',
          email: parsed.email || '',
        }));
        if (parsed.avatar) setAvatar(parsed.avatar);
        if (parsed.playerLife) setPlayerLife(parsed.playerLife);
      } catch (e) {
        // ignore
      }
    }
  }, []);

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
            <div className={styles.badge}>Em breve</div>
            <div className={styles.badge}>Em breve</div>
            <div className={styles.badge}>Em breve</div>
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

        <h3>Pagamento</h3>
        <label className={styles.label}>
          Número do cartão
          <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={styles.input} placeholder="1234 5678 9012 3456" />
        </label>

        <div className={styles.row}>
          <label className={styles.labelSmall}>
            CVV
            <input name="cvv" value={form.cvv} onChange={handleChange} className={styles.input} placeholder="123" />
          </label>
          <label className={styles.labelSmall}>
            Validade
            <input name="expiry" value={form.expiry} onChange={handleChange} className={styles.input} placeholder="MM/AA" />
          </label>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default UserPage;
