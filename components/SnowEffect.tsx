
import React, { useMemo } from 'react';

const SnowEffect: React.FC = () => {
  // Gera flocos de neve com propriedades aleatórias para um visual natural
  const flakes = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`, // Entre 5s e 10s
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.1, // Opacidade entre 0.1 e 0.6
      size: `${Math.random() * 4 + 2}px` // Tamanho entre 2px e 6px
    }));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes snowfall {
            0% {
              transform: translateY(-10vh) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) translateX(20px);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {flakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute top-0 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animation: `snowfall ${flake.animationDuration} linear infinite`,
              animationDelay: flake.animationDelay,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SnowEffect;
