import React from 'react';

interface TarsierIconProps {
  className?: string;
  size?: number;
}

export const TarsierIcon: React.FC<TarsierIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M500 150C350 150 250 250 250 400V850C250 900 290 940 340 940H660C710 940 750 900 750 850V400C750 250 650 150 500 150Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="40"
      />
      <circle cx="400" cy="500" r="80" fill="#4CAF50" />
      <circle cx="600" cy="500" r="80" fill="#4CAF50" />
      <circle cx="400" cy="500" r="40" fill="white" />
      <circle cx="600" cy="500" r="40" fill="white" />
      <path
        d="M450 600C450 627.614 472.386 650 500 650C527.614 650 550 627.614 550 600"
        stroke="currentColor"
        strokeWidth="40"
        strokeLinecap="round"
      />
      <path
        d="M250 400V200C250 150 290 110 340 110H400"
        stroke="currentColor"
        strokeWidth="40"
        strokeLinecap="round"
      />
    </svg>
  );
}; 