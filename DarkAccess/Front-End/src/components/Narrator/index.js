import React, { useEffect, useState, useRef } from "react";
import styles from "./Narrator.module.css";

function Narrator({
  etapa,
  usuario,
  skipSignal,
  repeatTrigger,
  onFalaReady,
}) {
  const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

  const [text, setText] = useState("");
  const [fullText, setFullText] = useState("");
  const [writing, setWriting] = useState(false);

  const indexRef = useRef(0);
  const cancelRef = useRef(false);
  const currentEtapaRef = useRef(null);


  const loadFala = async (etp) => {
    try {
      const url = `${API_URL}/api/narrador/fala/${etp}${
        usuario ? `?userId=${usuario.id}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      const falaRecebida = data?.fala?.fala ?? "";
      const falaLimpa = falaRecebida.replace(/undefined/gi, "");

      setFullText(falaLimpa);

      setText("");
      indexRef.current = 0;
      setWriting(true);

      onFalaReady?.({
        fala: falaLimpa,
        etapa: data?.fala?.etapa || etp,
        resposta_correta: data?.fala?.resposta_correta || null
      });
    } catch {
      setFullText("Erro ao carregar fala do narrador.");
      setText("Erro ao carregar fala do narrador.");
      setWriting(false);
    }
  };

  useEffect(() => {
    if (!etapa) return;

    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      currentEtapaRef.current = etapa;
      loadFala(etapa);
    }, 50);
  }, [etapa]);

  useEffect(() => {
    if (!writing) return;
    if (!fullText) return;

    cancelRef.current = false;

    const interval = setInterval(() => {
      if (cancelRef.current) {
        clearInterval(interval);
        return;
      }

      if (indexRef.current >= fullText.length) {
        setWriting(false);
        clearInterval(interval);
        return;
      }

      setText((old) => old + fullText[indexRef.current]);
      indexRef.current++;
    }, 22); 

    return () => clearInterval(interval);
  }, [writing, fullText]);


  useEffect(() => {
    if (skipSignal === 0) return;

    if (writing) {
      cancelRef.current = true;
      setWriting(false);
      setText(fullText);
      return;
    }

    loadFala(currentEtapaRef.current);
  }, [skipSignal]);

  useEffect(() => {
    if (repeatTrigger === 0) return;

    cancelRef.current = true;

    setTimeout(() => {
      cancelRef.current = false;
      setText("");
      indexRef.current = 0;
      setWriting(true);
    }, 80);
  }, [repeatTrigger]);

  return (
    <div className={styles.box}>
      <p className={styles.text}>
        {text}
        {writing && <span className={styles.cursor}>█</span>}
      </p>
    </div>
  );
}

export default Narrator;
