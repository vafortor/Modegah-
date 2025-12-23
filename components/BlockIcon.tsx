
import React from 'react';

const BlockIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Outer Block Frame */}
    <rect x="2" y="6" width="20" height="12" rx="1.5" />
    {/* Left Hollow Core */}
    <rect x="5.5" y="9.5" width="5.5" height="5" rx="1" />
    {/* Right Hollow Core */}
    <rect x="13" y="9.5" width="5.5" height="5" rx="1" />
  </svg>
);

export default BlockIcon;
