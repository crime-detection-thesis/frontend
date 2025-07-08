import React from 'react';

interface FormContainerProps {
    children: React.ReactNode;
    title: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, title }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
            <h2 className="text-white text-2xl font-bold mb-6">{title}</h2>
            {children}
        </div>
    </div>
);

export default FormContainer;
