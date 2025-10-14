import React, { useState, useEffect } from 'react';
import styles from './Narrator.module.css';

const Narrator = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = messages[currentMessageIndex];
    const handleTyping = () => {
      if (isDeleting) {
        setDisplayedText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText((prev) => fullText.substring(0, prev.length + 1));
      }
    };

    const typingSpeed = isDeleting ? 50 : 100;
    const typingTimeout = setTimeout(handleTyping, typingSpeed);

    if (!isDeleting && displayedText === fullText) {
      setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }

    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, messages, currentMessageIndex]);

  return (
    <div className={styles.narratorBox}>
      <p>{displayedText}<span className={styles.cursor}>|</span></p>
    </div>
  );
};

export default Narrator;