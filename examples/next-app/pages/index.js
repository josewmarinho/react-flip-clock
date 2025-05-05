'use client';
import React from 'react';

import FlipClock from 'react-flip-clock-countdown';

const Example = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <React.Fragment>
      <h2>Default</h2>
      <FlipClock
        mode='up'
        from={new Date(2022, 4, 2, 23, 0, 0)} // 02‑May‑2022 23:00
        labels={['Anos', 'Meses', 'Dias', 'Horas', 'Minutos', 'Segundos']}
        dividerStyle={{
          color: '#c2c2c2',
          height: 1
        }}
        digitBlockStyle={{
          width: 45,
          height: 65,
          fontSize: 32,
          borderRadius: 6,
          backgroundColor: '#ff007f',
          color: '#000000'
        }}
        spacing={{ clock: 10, digitBlock: 4 }}
      >
        Finished
      </FlipClock>
    </React.Fragment>
  );
};

export default Example;
