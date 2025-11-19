import React, { useState } from 'react';
import styles from './Deep.module.css';

export default function DeepWebPage() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log('Buscando por:', query);
    // Aqui você pode redirecionar ou fazer fetch futuramente
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Gogle — Deep Search</h1>
        <p className={styles.subtitle}>Navegue pelos serviços ocultos da rede DALL·E</p>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            type="search"
            className={styles.searchInput}
            value={query}
            placeholder="Pesquisar na Gogle..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>
      </div>
    </div>
  );
}
