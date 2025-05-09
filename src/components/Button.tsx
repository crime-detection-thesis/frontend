import React from 'react';

interface ButtonProps {
    type: 'submit' | 'button';
    onClick?: () => void;
    text: string;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, text }) => (
    <button
        type={type}
        onClick={onClick}
        className="w-full bg-gray-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        {text}
    </button>
);

export default Button;
