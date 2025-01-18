import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}
