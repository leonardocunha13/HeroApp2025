// src/components/ui/card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;  // Add onClick to handle clicks
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`border rounded-md shadow-sm bg-white p-4 ${className}`}
      onClick={onClick}  // Attach onClick here
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };