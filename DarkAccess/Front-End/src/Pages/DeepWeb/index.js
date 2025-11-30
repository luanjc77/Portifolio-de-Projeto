import React from 'react';
import styles from './Deep.module.css';

export default function DeepWebPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.paragraph}>
          Parabéns! Você acaba de atravessar a superfície e conectar-se a uma rede das profundezas.
        </p>
        
        <p className={styles.paragraph}>
          Através desta VPN, você conquistou acesso a recursos que não existem para o público comum — serviços internos, arquivos, sistemas e conteúdos protegidos, criados para serem vistos apenas por aqueles que possuem a permissão necessária. Aqui, cada informação é guardada com rigor, e somente quem realmente "entra" na rede pode interagir com ela, preservando segurança, controle e sigilo.
        </p>
        
        <p className={styles.paragraph}>
          Este é o território que chamamos de <span className={styles.highlight}>deep web</span>: um domínio oculto aos olhos comuns, inacessível sem autorização. Painéis administrativos, redes privadas, serviços que exigem autenticação — todos fazem parte desse submundo digital onde apenas aqueles com a chave correta podem avançar.
        </p>
        
        <p className={styles.paragraph}>
          E agora, você chegou até aqui.
        </p>
        
        <p className={styles.paragraph}>
          Este é o fim da nossa jornada… <span className={styles.highlight}>por enquanto</span>.
        </p>
        
        <p className={styles.paragraph}>
          Novos ambientes, narrativas e desafios estão sendo preparados. Em breve, você poderá explorar camadas ainda mais profundas e continuar aprendendo, evoluindo e desvendando o desconhecido.
        </p>
      </div>
    </div>
  );
}
