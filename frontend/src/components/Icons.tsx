import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const IconPlus: React.FC<IconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

export const IconArrowLeft: React.FC<IconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="13" y1="8" x2="3" y2="8" />
    <polyline points="7 4 3 8 7 12" />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9 4 13 8 9 12" />
  </svg>
);

export const IconClose: React.FC<IconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="7" cy="7" r="4.5" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" />
  </svg>
);

export const IconEdit: React.FC<IconProps> = ({ size = 13, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L4.5 13.5 2 14l.5-2.5 9-9z" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size = 13, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polyline points="2 4 14 4" />
    <path d="M5 4V2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V4" />
    <path d="M3.5 4l.8 9.2A1.5 1.5 0 0 0 5.8 14.5h4.4a1.5 1.5 0 0 0 1.5-1.3L12.5 4" />
  </svg>
);

/* Status Indicator Glyphs */
export const IconStatusTodo: React.FC<IconProps> = ({ size = 11, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} style={style} aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconStatusInProgress: React.FC<IconProps> = ({ size = 11, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} style={style} aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 1.5 A4.5 4.5 0 0 1 6 10.5 Z" fill="currentColor" />
  </svg>
);

export const IconStatusDone: React.FC<IconProps> = ({ size = 11, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} style={style} aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" fill="currentColor" />
    <path d="M3.8 6.2 L5.2 7.6 L8.4 4.4" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconStatusOpen: React.FC<IconProps> = ({ size = 11, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} style={style} aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="6" r="2" fill="currentColor" />
  </svg>
);

/* Priority Indicator Glyphs */
export const IconPriorityHigh: React.FC<IconProps> = ({ size = 10, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" className={className} style={style} aria-hidden="true">
    <path d="M5 1.5 L8.5 7.5 L1.5 7.5 Z" />
  </svg>
);

export const IconPriorityMed: React.FC<IconProps> = ({ size = 9, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" className={className} style={style} aria-hidden="true">
    <rect x="2" y="2" width="6" height="6" rx="1" />
  </svg>
);

export const IconPriorityLow: React.FC<IconProps> = ({ size = 10, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" className={className} style={style} aria-hidden="true">
    <path d="M5 8.5 L1.5 2.5 L8.5 2.5 Z" />
  </svg>
);
