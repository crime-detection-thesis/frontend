import React from 'react';

export interface Option {
  label: string;
  value: string;
}

type SelectVariant = 'dark' | 'bordered';

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: SelectVariant;
  disabled?: boolean;
}

const variantStyles = {
  dark: `
    bg-gray-700
    text-white
    border-gray-600
    focus:border-[var(--color-primary)]
    focus:ring-[var(--color-primary)]
    focus:ring-1
  `,
  bordered: `
    bg-gray-700
    text-white
    border-2 border-gray-600
    focus:border-[var(--color-primary)]
    focus:ring-[var(--color-primary)]
    focus:ring-1
  `,
};

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = '',
  variant = 'dark',
  disabled = false,
}) => (
  <select
    disabled={disabled}
    className={`
      w-full rounded-md shadow-sm py-2 pl-3 pr-10 text-base
      focus:outline-none transition-colors
      ${variantStyles[variant]}
      ${className}
    `}
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {placeholder && (
      <option value="" disabled className="bg-gray-700 text-gray-400">
        {placeholder}
      </option>
    )}
    {options.map(opt => (
      <option
        key={opt.value}
        value={opt.value}
        className="bg-gray-700 text-white"
      >
        {opt.label}
      </option>
    ))}
  </select>
);

export default Select;
