import React from 'react';

interface AvatarProps {
  name: string;
  className?: string; 
}

function generateColorFromName(name: string, saturation = 70, lightness = 55): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}\u200C${words[1].charAt(0)}`;
  } else if (words.length === 1 && words[0].length > 0) {
    return words[0].charAt(0);
  }
  return "?";
}

export default function Avatar({ name, className = "w-10 h-10 text-base rounded-full" }: AvatarProps) {
  const initials = getInitials(name || "?");
  const color1 = generateColorFromName(name || "?", 70, 55);
  const color2 = generateColorFromName((name || "?") + "salt", 70, 45);
  
  const bgStyle = `linear-gradient(135deg, ${color1}, ${color2})`;

  return (
    <div 
      className={`flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 ${className}`}
      style={{ background: bgStyle }}
    >
      {initials}
    </div>
  );
}
