import React from 'react';

interface InputProps {
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ id, type, label, value, onChange, required = false }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-300 text-sm font-medium">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            required={required}
        />
    </div>
);

export default Input;
