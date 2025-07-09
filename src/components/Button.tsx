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
  primary: `
    button-primary
    bg-[var(--color-primary)]
    hover:bg-[var(--color-primary-hover)]
    text-white
    focus:ring-[var(--color-primary)]
  `,
  secondary: `
    button-secondary
    bg-gray-200
    hover:bg-gray-300
    text-gray-800
    focus:ring-[var(--color-primary)]
  `,
  danger: `
    button-danger
    bg-[var(--color-danger)]
    hover:bg-[var(--color-danger-hover)]
    text-white
    focus:ring-[var(--color-danger)]
  `,
  success: `
    button-success
    bg-green-600
    hover:bg-green-700
    text-white
    focus:ring-green-500
  `,
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
    className={`
      w-full py-2 px-4 rounded-md shadow-md
      focus:outline-none focus:ring-2 transition-colors
      ${variantStyles[variant]}
      ${className}
    `}
  >
    {text}
  </button>
);

export default Button;
