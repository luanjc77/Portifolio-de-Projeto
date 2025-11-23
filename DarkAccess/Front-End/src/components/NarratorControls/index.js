import React from "react";
import styles from "./NarratorControls.module.css";

export default function NarratorControls({onSkip, onRepeat, onHint, onSend, showInput = false, responseValue = "", onChangeResponse,}) {
  return (
    <div className={styles.controlsWrapper}>
      
      {/* Input aparece somente na HomePage */}
      {showInput && (
        <input
          className={styles.responseInput}
          type="text"
          placeholder="Digite sua resposta…"
          value={responseValue}
          onChange={(e) => onChangeResponse(e.target.value)}
        />
      )}

      <div className={styles.buttonRow}>
        {onSkip && (
          <button onClick={onSkip} className={styles.btn}>
            Pular fala
          </button>
        )}

        {onRepeat && (
          <button onClick={onRepeat} className={styles.btn}>
            Repetir
          </button>
        )}

        {onHint && (
          <button onClick={onHint} className={styles.btn}>
            Dica
          </button>
        )}

        {onSend && (
          <button onClick={onSend} className={styles.btnPrimary}>
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}
