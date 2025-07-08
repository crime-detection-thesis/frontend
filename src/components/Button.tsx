import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps {
  type: 'submit' | 'button';
  onClick?: () => void;
  text: string;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
}

const variantStyles = {
  primary: 'button-primary bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'button-secondary bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'button-danger bg-red-600 hover:bg-red-700 text-white',
  success: 'button-success bg-green-600 hover:bg-green-700 text-white',
};

const Button: React.FC<ButtonProps> = ({ 
  type, 
  onClick, 
  text, 
  className = "", 
  disabled = false, 
  variant = 'primary' 
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${variantStyles[variant]} ${className}`}
  >
    {text}
  </button>
);

export default Button;
