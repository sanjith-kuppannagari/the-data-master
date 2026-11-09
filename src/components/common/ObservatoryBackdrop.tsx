import React from 'react';

interface ObservatoryBackdropProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
}

export const ObservatoryBackdrop: React.FC<ObservatoryBackdropProps> = ({
  className = '',
  intensity = 'subtle',
}) => {
  const opacityMap = {
    subtle: 'opacity-20',
    medium: 'opacity-35',
    vibrant: 'opacity-50',
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Background Coordinate Grid */}
      <div
        className={`absolute inset-0 ${opacityMap[intensity]}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(198, 243, 107, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(198, 243, 107, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Abstract Glowing Node Constellations */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Geometric Observatory Lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 stroke-charcoal-border"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10%" y1="20%" x2="40%" y2="25%" stroke="#C6F36B" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        <line x1="40%" y1="25%" x2="70%" y2="15%" stroke="#75D6D0" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
        <line x1="40%" y1="25%" x2="50%" y2="60%" stroke="#FFAA73" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
        <line x1="70%" y1="15%" x2="85%" y2="45%" stroke="#F5F3EA" strokeWidth="1" strokeDasharray="2 4" opacity="0.2" />
        <circle cx="10%" cy="20%" r="2" fill="#C6F36B" />
        <circle cx="40%" cy="25%" r="3" fill="#C6F36B" />
        <circle cx="70%" cy="15%" r="2" fill="#75D6D0" />
        <circle cx="50%" cy="60%" r="2.5" fill="#FFAA73" />
        <circle cx="85%" cy="45%" r="2" fill="#F5F3EA" />
      </svg>
    </div>
  );
};
