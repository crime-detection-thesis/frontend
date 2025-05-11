import React from 'react';

interface ButtonProps {
  type: 'submit' | 'button';
  onClick?: () => void;
  text: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, text, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {text}
  </button>
);

export default Button;
