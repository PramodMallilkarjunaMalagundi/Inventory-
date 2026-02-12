
import React from 'react';

interface LogoProps {
  className?: string;
  hideText?: boolean;
  textColor?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", hideText = false, textColor = 'light' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 240 200" className="h-full w-auto drop-shadow-xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Subtle Shadow under the box */}
        <ellipse cx="100" cy="175" rx="55" ry="8" fill="black" fillOpacity="0.08" />
        
        {/* Isometric Box Structure */}
        <g transform="translate(40, 40)">
          {/* Top Surface */}
          <path d="M60 0 L120 30 L60 60 L0 30 Z" fill="url(#grad-top)" />
          {/* Left Side Surface */}
          <path d="M0 30 L60 60 L60 120 L0 90 Z" fill="url(#grad-side-left)" />
          {/* Right Side Surface */}
          <path d="M60 60 L120 30 L120 90 L60 120 Z" fill="url(#grad-side-right)" />
          
          {/* Box Sealing Tape */}
          <path d="M45 7.5 L75 22.5 L60 30 L30 15 Z" fill="white" fillOpacity="0.85" />
        </g>
        
        {/* Magnifying Glass with Chart (The "Insight" part) */}
        <g transform="translate(100, 70)">
          {/* Glass Handle */}
          <rect x="75" y="75" width="45" height="14" rx="7" transform="rotate(45, 75, 75)" fill="#075985" />
          
          {/* Glass Outer Rim */}
          <circle cx="50" cy="50" r="48" fill="white" />
          <circle cx="50" cy="50" r="48" stroke="#075985" strokeWidth="8" />
          
          {/* Lens Interior Glow */}
          <circle cx="50" cy="50" r="40" fill="url(#grad-lens-inner)" />
          
          {/* Bar Chart Bars inside the lens */}
          <g transform="translate(25, 30)">
            <rect x="0" y="25" width="10" height="20" rx="3" fill="#FBBF24" />
            <rect x="18" y="10" width="10" height="35" rx="3" fill="#10B981" />
            <rect x="36" y="0" width="10" height="45" rx="3" fill="#0284C7" />
          </g>
          
          {/* Lens Reflection highlight */}
          <path d="M20 30 Q30 20 50 20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>

        <defs>
          <linearGradient id="grad-top" x1="0" y1="0" x2="120" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" /> {/* Vibrant Yellow */}
            <stop offset="100%" stopColor="#F97316" /> {/* Vibrant Orange */}
          </linearGradient>
          <linearGradient id="grad-side-left" x1="0" y1="30" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E635" /> {/* Lime Green */}
            <stop offset="100%" stopColor="#15803D" /> {/* Forest Green */}
          </linearGradient>
          <linearGradient id="grad-side-right" x1="60" y1="30" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" /> {/* Bright Cyan */}
            <stop offset="100%" stopColor="#0E7490" /> {/* Deep Teal */}
          </linearGradient>
          <radialGradient id="grad-lens-inner" cx="50" cy="50" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="85%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
      
      {!hideText && (
        <span className={`text-2xl font-black tracking-tight flex items-center leading-none ${textColor === 'light' ? 'text-white' : 'text-slate-900'}`}>
          <span className="text-[#0891B2]">Inven</span>
          <span className="text-[#EA580C]">Track</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
