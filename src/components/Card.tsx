import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-700 rounded-lg shadow p-4 ${className}`}>      
      {title && <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>}
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default Card;
