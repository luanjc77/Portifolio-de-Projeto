import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Narrador({ etapa, usuario, messages, repeatTrigger = 0, onFalaReady }) {
  const [fala, setFala] = useState(null);
  const [typed, setTyped] = useState('');
  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const getApiBase = () => {
    const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
    const API_PORT = process.env.REACT_APP_API_PORT || (window.location.port ? window.location.port : '3001');
    return process.env.REACT_APP_API_BASE || `http://${API_HOST}:${API_PORT}`;
  };

  useEffect(() => {
    // If caller provided messages directly, use them and skip fetch
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const full = messages[0] || '';
      // start typing animation
      setTyped('');
      setFala(null);
      let i = 0;
      const speed = 20; // ms per character
      const timer = setInterval(() => {
        i += 1;
        setTyped(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(timer);
          const built = { fala: full, etapa: etapa || 'inicio' };
          setFala(built);
          if (typeof onFalaReady === 'function') onFalaReady(built);
        }
      }, speed);
      return () => clearInterval(timer);
    }

    if (!etapa) {
      // nothing to fetch
      return;
    }

    const base = getApiBase();

    axios.get(`${base}/api/narrador/fala/${etapa}`).then((res) => {
      if (res.data.success) {
        setFala(res.data.fala);
        if (typeof onFalaReady === 'function') onFalaReady(res.data.fala);
      }
    }).catch((err) => {
      console.error('Erro ao buscar fala do narrador:', err);
    });
  }, [etapa, messages]);

  // when parent requests a repeat, re-run the typing animation for current fala
  useEffect(() => {
    if (!fala || !fala.fala) return;
    // re-type the fala text
    setTyped('');
    let i = 0;
    const full = fala.fala;
    const speed = 20;
    const timer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [repeatTrigger]);

  const enviarResposta = async () => {
    try {
      const base = getApiBase();
      const res = await axios.post(`${base}/api/narrador/resposta`, {
        etapa,
        resposta,
        usuario_id: usuario && usuario.id,
      });
      setFeedback(res.data.mensagem);
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
      setFeedback('Erro ao enviar resposta.');
    }
  };

  if (!fala && !typed) return <p>Carregando narrativa...</p>;

  return (
    <div className="narrador-container">
      <p className="fala-texto">{typed || (fala && fala.fala)}</p>

      {fala?.resposta_correta && (
        <div className="resposta-box">
          <input
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta..."
          />
          <button onClick={enviarResposta}>Responder</button>
        </div>
      )}

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
