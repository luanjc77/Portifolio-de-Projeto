import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Narrador({ etapa, usuario, messages = [], repeatTrigger = 0, onFalaReady }) {
  const [falaObj, setFalaObj] = useState(null);
  const [typed, setTyped] = useState('');
  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [dica, setDica] = useState(null);

  const getApiBase = () => {
    const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
    const API_PORT = process.env.REACT_APP_API_PORT || (window.location.port ? window.location.port : '3001');
    return process.env.REACT_APP_API_BASE || `http://${API_HOST}:${API_PORT}`;
  };

  useEffect(() => {
    // if messages prop provided (override) -> show those
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const built = { fala: messages.join('\n\n'), etapa };
      setFalaObj(built);
      startTyping(built.fala);
      if (typeof onFalaReady === 'function') onFalaReady(built);
      return;
    }

    if (!etapa) return;

    const fetchFala = async () => {
      setLoading(true);
      try {
        const base = getApiBase();
        // pass userId if we have usuario
        const userIdPart = usuario && usuario.id ? `?userId=${usuario.id}` : '';
        const res = await axios.get(`${base}/api/narrador/fala/${encodeURIComponent(etapa)}${userIdPart}`);
        if (res.data && res.data.success && res.data.fala) {
          setFalaObj(res.data.fala);
          startTyping(res.data.fala.fala || '');
          if (typeof onFalaReady === 'function') onFalaReady(res.data.fala);
        } else {
          setFalaObj({ fala: 'Nada a dizer no momento.' });
          startTyping('Nada a dizer no momento.');
        }
      } catch (err) {
        console.error('Erro ao buscar fala:', err);
        setFalaObj({ fala: 'Erro ao carregar narrador.' });
        startTyping('Erro ao carregar narrador.');
      } finally {
        setLoading(false);
      }
    };

    fetchFala();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa, usuario]);

  // repeatTrigger: re-type current fala
  useEffect(() => {
    if (!falaObj || !falaObj.fala) return;
    startTyping(falaObj.fala);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatTrigger]);

  function startTyping(full) {
    setTyped('');
    let i = 0;
    const speed = 18;
    const timer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }

  async function pedirDica() {
    if (!etapa) return;
    try {
      const base = getApiBase();
      const userIdPart = usuario && usuario.id ? `?userId=${usuario.id}` : '';
      const res = await axios.get(`${base}/api/narrador/dica/${encodeURIComponent(etapa)}${userIdPart}`);
      if (res.data && res.data.success && res.data.dica) setDica(res.data.dica);
      else setDica('Nenhuma dica disponível.');
    } catch (err) {
      console.error('Erro dica:', err);
      setDica('Erro ao buscar dica.');
    }
  }

  async function enviarResposta() {
    if (!etapa || !usuario || !usuario.id) {
      setFeedback('Você precisa estar logado para responder.');
      return;
    }
    try {
      const base = getApiBase();
      const res = await axios.post(`${base}/api/narrador/resposta`, {
        etapa,
        resposta,
        usuario_id: usuario.id
      });
      if (res.data && res.data.success) {
        setFeedback(res.data.mensagem || 'Resposta enviada.');
        // se correta e há conquista/aviso, podemos informar
      } else {
        setFeedback(res.data.message || 'Erro ao enviar resposta.');
      }
    } catch (err) {
      console.error('Erro enviar resposta:', err);
      setFeedback('Erro ao enviar resposta.');
    }
  }

  if (!falaObj && loading) return <div>Carregando narrador...</div>;

  return (
    <div className="narrador">
      <div className="narrador-text">
        <p>{typed || (falaObj && falaObj.fala) || '...'}</p>
      </div>

      {falaObj && falaObj.resposta_correta && (
        <div className="narrador-resposta">
          <input
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta..."
          />
          <button onClick={enviarResposta}>Responder</button>
          <button onClick={pedirDica} style={{ marginLeft: 8 }}>Pedir dica</button>
        </div>
      )}

      {dica && <div className="narrador-dica"><small>Dica: {dica}</small></div>}
      {feedback && <div className="narrador-feedback"><small>{feedback}</small></div>}
    </div>
  );
}
