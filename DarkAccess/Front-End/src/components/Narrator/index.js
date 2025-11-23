import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function Narrador({
  etapa,
  usuario,
  messages = [],
  repeatTrigger = 0,
  skipSignal = 0,
  onFalaReady = null
}) {
  const [falaObj, setFalaObj] = useState(null);
  const [typed, setTyped] = useState('');

  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const [dica, setDica] = useState('');
  const [loading, setLoading] = useState(false);

  const typingTimer = useRef(null);

  const getApiBase = () => {
    const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
    const API_PORT = process.env.REACT_APP_API_PORT || window.location.port || '3001';
    return `http://${API_HOST}:${API_PORT}`;
  };

  // ------------------------------------------------------------
  // 🔹 CARREGAR A FALA DO NARRADOR
  // ------------------------------------------------------------
  useEffect(() => {
    // Caso HomePage envie "messages"
    if (messages.length > 0) {
      const msg = messages.join("\n\n");
      const falaPack = { fala: msg, etapa: etapa || 'default' };

      setFalaObj(falaPack);
      startTyping(msg);

      if (onFalaReady) onFalaReady(falaPack);
      return;
    }

    if (!etapa) return;

    const fetchFala = async () => {
      setLoading(true);

      try {
        const base = getApiBase();
        const qs = usuario?.id ? `?userId=${usuario.id}` : '';

        const res = await axios.get(`${base}/api/narrador/fala/${encodeURIComponent(etapa)}${qs}`);

        if (res.data?.success && res.data.fala) {
          setFalaObj(res.data.fala);
          startTyping(res.data.fala.fala || '');

          if (onFalaReady) onFalaReady(res.data.fala);
        } else {
          const fallback = { fala: 'Nada a dizer no momento.' };
          setFalaObj(fallback);
          startTyping(fallback.fala);
        }

      } catch (err) {
        console.error('Erro ao carregar fala:', err);
        const errorMsg = { fala: 'Erro ao carregar narrador.' };
        setFalaObj(errorMsg);
        startTyping(errorMsg.fala);
      }

      setLoading(false);
    };

    fetchFala();
  }, [etapa, usuario]);


  // ------------------------------------------------------------
  // 🔹 REPETIR FALA
  // ------------------------------------------------------------
  useEffect(() => {
    if (falaObj?.fala) startTyping(falaObj.fala);
  }, [repeatTrigger]);


  // ------------------------------------------------------------
  // 🔹 SKIP — completar fala sem animação
  // ------------------------------------------------------------
  useEffect(() => {
    if (falaObj?.fala) {
      setTyped(falaObj.fala);
      stopTyping();
    }
  }, [skipSignal, falaObj]);


  // ------------------------------------------------------------
  // 🔹 ANIMAÇÃO DE DIGITAÇÃO
  // ------------------------------------------------------------
  function startTyping(fullText) {
    stopTyping();
    setTyped('');

    let i = 0;
    typingTimer.current = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));

      if (i >= fullText.length) stopTyping();
    }, 40);
  }

  function stopTyping() {
    if (typingTimer.current) {
      clearInterval(typingTimer.current);
      typingTimer.current = null;
    }
  }


  // ------------------------------------------------------------
  // 🔹 PEDIR DICA
  // ------------------------------------------------------------
  async function pedirDica() {
    if (!etapa) return;

    try {
      const base = getApiBase();
      const qs = usuario?.id ? `?userId=${usuario.id}` : '';

      const res = await axios.get(`${base}/api/narrador/dica/${encodeURIComponent(etapa)}${qs}`);
      setDica(res.data?.dica || "Nenhuma dica disponível.");
    } catch (err) {
      console.error(err);
      setDica("Erro ao buscar dica.");
    }
  }


  // ------------------------------------------------------------
  // 🔹 ENVIAR RESPOSTA
  // ------------------------------------------------------------
  async function enviarResposta() {
    if (!usuario?.id) {
      setFeedback("Você precisa estar logado.");
      return;
    }

    try {
      const base = getApiBase();

      const res = await axios.post(`${base}/api/narrador/resposta`, {
        etapa,
        resposta,
        usuario_id: usuario.id
      });

      setFeedback(res.data?.mensagem || "Resposta enviada!");

    } catch (err) {
      console.error(err);
      setFeedback("Erro ao enviar resposta.");
    }
  }


  // ------------------------------------------------------------
  // 🔹 RENDERIZAÇÃO
  // ------------------------------------------------------------
  if (loading && !falaObj) return <p>Carregando narrador...</p>;

  return (
    <div className="narrador">

      <div className="narrador-text">
        <p>{typed}</p>
      </div>

      {falaObj?.resposta_correta && (
        <div className="narrador-resposta">
          <input
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta..."
          />
          <button onClick={enviarResposta}>Responder</button>
          <button onClick={pedirDica}>Dica</button>
        </div>
      )}

      {dica && <div className="narrador-dica"><small>Dica: {dica}</small></div>}
      {feedback && <div className="narrador-feedback"><small>{feedback}</small></div>}

    </div>
  );
}
