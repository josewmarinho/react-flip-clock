import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';
import { Digit } from './types';

export interface FlipClockDigitProps {
  current: Digit;
  next: Digit; // mantido para compat mas não utilizado
  className?: string;
  style?: React.CSSProperties;
}

export default function FlipClockDigit({ current, className, style }: FlipClockDigitProps) {
  const [{ cur, nxt }, setDigits] = React.useState<{ cur: Digit; nxt: Digit }>({ cur: current, nxt: current });
  const [flipped, setFlipped] = React.useState(false);

  /* 1️⃣   Quando `current` muda → colocar em `nxt` e flipar */
  React.useEffect(() => {
    if (current === cur) return; // nada mudou → sem flip
    setDigits((prev) => ({ ...prev, nxt: current }));
    setFlipped(true);
  }, [current, cur]);

  /* 2️⃣   Após o flip, promovemos `cur = current` e zeramos flip */
  const handleTransitionEnd = () => {
    setDigits({ cur: current, nxt: current });
    setFlipped(false);
  };

  return (
    <div className={clsx('fcc__digit_block', styles.fcc__digit_block, className)} style={style}>
      {/* metades estáticas */}
      <div className={styles.fcc__next_above}>{nxt}</div>
      <div className={styles.fcc__current_below}>{cur}</div>

      {/* cartão animado */}
      <div className={clsx(styles.fcc__card, { [styles.fcc__flipped]: flipped })} onTransitionEnd={handleTransitionEnd}>
        <div className={clsx(styles.fcc__card_face, styles.fcc__card_face_front)}>{cur}</div>
        <div className={clsx(styles.fcc__card_face, styles.fcc__card_face_back)}>{nxt}</div>
      </div>
    </div>
  );
}
