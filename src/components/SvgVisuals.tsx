import React from 'react';

export const AppleSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    {/* Stem */}
    <path d="M32 14 C34 8, 38 4, 42 4" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Leaf */}
    <path d="M34 10 C38 8, 44 10, 44 14 C40 16, 36 14, 34 10 Z" fill="#4CAF50" />
    {/* Apple Body */}
    <path
      d="M22 16 C12 16, 6 26, 6 38 C6 50, 16 60, 26 60 C30 60, 31 58, 32 58 C33 58, 34 60, 38 60 C48 60, 58 50, 58 38 C58 26, 52 16, 42 16 C37 16, 33 20, 32 20 C31 20, 27 16, 22 16 Z"
      fill="#EF4444"
    />
    {/* Highlight shine */}
    <ellipse cx="20" cy="28" rx="4" ry="7" transform="rotate(-20 20 28)" fill="#FCA5A5" opacity="0.6" />
  </svg>
);

export const StarSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    <polygon
      points="32,4 40,22 60,24 45,38 49,58 32,47 15,58 19,38 4,24 24,22"
      fill="#FBBF24"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="30" r="2.5" fill="#78350F" />
    <circle cx="38" cy="30" r="2.5" fill="#78350F" />
    <path d="M28 36 Q32 40 36 36" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const FlowerSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    <circle cx="32" cy="18" r="10" fill="#F472B6" />
    <circle cx="46" cy="32" r="10" fill="#F472B6" />
    <circle cx="32" cy="46" r="10" fill="#F472B6" />
    <circle cx="18" cy="32" r="10" fill="#F472B6" />
    <circle cx="22" cy="22" r="9" fill="#FB7185" />
    <circle cx="42" cy="22" r="9" fill="#FB7185" />
    <circle cx="42" cy="42" r="9" fill="#FB7185" />
    <circle cx="22" cy="42" r="9" fill="#FB7185" />
    <circle cx="32" cy="32" r="10" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
  </svg>
);

export const FishSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    {/* Tail */}
    <polygon points="56,22 56,42 42,32" fill="#38BDF8" />
    {/* Body */}
    <ellipse cx="28" cy="32" rx="20" ry="14" fill="#0EA5E9" />
    {/* Eye */}
    <circle cx="16" cy="28" r="3" fill="#FFFFFF" />
    <circle cx="15" cy="28" r="1.5" fill="#0F172A" />
    {/* Fin */}
    <path d="M28 32 Q32 38 38 34" stroke="#0284C7" strokeWidth="2" fill="none" />
  </svg>
);

export const OrangeSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    <path d="M32 12 C34 8, 38 6, 42 6" stroke="#5D4037" strokeWidth="2.5" fill="none" />
    <path d="M34 10 C38 8, 44 11, 43 14 C39 15, 36 13, 34 10 Z" fill="#22C55E" />
    <circle cx="32" cy="36" r="22" fill="#F97316" />
    <ellipse cx="24" cy="26" rx="3.5" ry="5.5" transform="rotate(-30 24 26)" fill="#FDBA74" opacity="0.6" />
  </svg>
);

export const ButterflySvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    {/* Wings */}
    <path d="M32 32 C20 10, 4 18, 10 32 C4 46, 20 54, 32 36 Z" fill="#A855F7" />
    <path d="M32 32 C44 10, 60 18, 54 32 C60 46, 44 54, 32 36 Z" fill="#A855F7" />
    <circle cx="20" cy="28" r="4" fill="#E9D5FF" />
    <circle cx="44" cy="28" r="4" fill="#E9D5FF" />
    {/* Body */}
    <ellipse cx="32" cy="34" rx="2.5" ry="12" fill="#4B5563" />
    {/* Antennae */}
    <path d="M32 22 Q28 14 26 14" stroke="#4B5563" strokeWidth="1.5" fill="none" />
    <path d="M32 22 Q36 14 38 14" stroke="#4B5563" strokeWidth="1.5" fill="none" />
  </svg>
);

export const CarSvg: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={`inline-block drop-shadow-sm ${className}`}>
    <path d="M10 34 L18 20 L46 20 L54 34 L56 42 L8 42 Z" fill="#EF4444" rx="4" />
    <path d="M20 22 L44 22 L48 32 L16 32 Z" fill="#93C5FD" />
    <circle cx="18" cy="44" r="6" fill="#1F2937" />
    <circle cx="18" cy="44" r="2.5" fill="#E5E7EB" />
    <circle cx="46" cy="44" r="6" fill="#1F2937" />
    <circle cx="46" cy="44" r="2.5" fill="#E5E7EB" />
  </svg>
);

export const ItemSvgRenderer: React.FC<{ type: string; size?: number; className?: string }> = ({
  type,
  size = 48,
  className = ''
}) => {
  switch (type.toLowerCase()) {
    case 'apple':
      return <AppleSvg size={size} className={className} />;
    case 'star':
      return <StarSvg size={size} className={className} />;
    case 'flower':
      return <FlowerSvg size={size} className={className} />;
    case 'fish':
      return <FishSvg size={size} className={className} />;
    case 'orange':
      return <OrangeSvg size={size} className={className} />;
    case 'butterfly':
      return <ButterflySvg size={size} className={className} />;
    case 'car':
      return <CarSvg size={size} className={className} />;
    default:
      return <AppleSvg size={size} className={className} />;
  }
};

// Geometric Shape Renderer
export const ShapeSvgRenderer: React.FC<{ type: string; size?: number; label?: string }> = ({
  type,
  size = 120,
  label
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-3">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
        {type === 'circle' && (
          <circle cx="50" cy="50" r="42" fill="#60A5FA" stroke="#2563EB" strokeWidth="4" />
        )}
        {type === 'square' && (
          <rect x="14" y="14" width="72" height="72" rx="4" fill="#34D399" stroke="#059669" strokeWidth="4" />
        )}
        {type === 'triangle' && (
          <polygon points="50,12 88,84 12,84" fill="#FBBF24" stroke="#D97706" strokeWidth="4" strokeLinejoin="round" />
        )}
        {type === 'rectangle' && (
          <rect x="8" y="24" width="84" height="52" rx="4" fill="#F472B6" stroke="#DB2777" strokeWidth="4" />
        )}
        {type === 'cube' && (
          <g>
            <polygon points="50,15 85,32 50,50 15,32" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2.5" />
            <polygon points="15,32 50,50 50,88 15,70" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2.5" />
            <polygon points="50,50 85,32 85,70 50,88" fill="#6D28D9" stroke="#7C3AED" strokeWidth="2.5" />
          </g>
        )}
        {type === 'cuboid' && (
          <g>
            <polygon points="40,18 90,26 65,46 15,38" fill="#F87171" stroke="#DC2626" strokeWidth="2.5" />
            <polygon points="15,38 65,46 65,82 15,74" fill="#EF4444" stroke="#DC2626" strokeWidth="2.5" />
            <polygon points="65,46 90,26 90,62 65,82" fill="#B91C1C" stroke="#DC2626" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {label && <span className="mt-2 text-base font-bold text-slate-700">{label}</span>}
    </div>
  );
};

// Friendly Alligator Crocodile Mouth (> < =)
export const CrocodileMouth: React.FC<{ symbol: string; size?: number }> = ({ symbol, size = 110 }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
        {symbol === '>' && (
          <g>
            {/* Upper Jaw */}
            <path d="M85 20 Q50 45 20 45" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Lower Jaw */}
            <path d="M85 80 Q50 55 20 55" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Sharp Teeth */}
            <polygon points="70,25 76,34 82,27" fill="#FFFFFF" />
            <polygon points="54,32 60,40 66,33" fill="#FFFFFF" />
            <polygon points="70,75 76,66 82,73" fill="#FFFFFF" />
            <polygon points="54,68 60,60 66,67" fill="#FFFFFF" />
            {/* Eye on top */}
            <circle cx="28" cy="34" r="8" fill="#22C55E" />
            <circle cx="28" cy="34" r="4" fill="#000000" />
            <circle cx="30" cy="32" r="1.5" fill="#FFFFFF" />
          </g>
        )}
        {symbol === '<' && (
          <g>
            {/* Upper Jaw */}
            <path d="M15 20 Q50 45 80 45" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Lower Jaw */}
            <path d="M15 80 Q50 55 80 55" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Sharp Teeth */}
            <polygon points="30,25 24,34 18,27" fill="#FFFFFF" />
            <polygon points="46,32 40,40 34,33" fill="#FFFFFF" />
            <polygon points="30,75 24,66 18,73" fill="#FFFFFF" />
            <polygon points="46,68 40,60 34,67" fill="#FFFFFF" />
            {/* Eye */}
            <circle cx="72" cy="34" r="8" fill="#22C55E" />
            <circle cx="72" cy="34" r="4" fill="#000000" />
            <circle cx="70" cy="32" r="1.5" fill="#FFFFFF" />
          </g>
        )}
        {symbol === '=' && (
          <g>
            {/* Equal bars with friendly croc skin */}
            <rect x="18" y="30" width="64" height="14" rx="7" fill="#16A34A" />
            <rect x="18" y="56" width="64" height="14" rx="7" fill="#16A34A" />
            <circle cx="70" cy="22" r="7" fill="#22C55E" />
            <circle cx="70" cy="22" r="3.5" fill="#000" />
            <circle cx="72" cy="20" r="1.2" fill="#FFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
