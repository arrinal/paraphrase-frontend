import React, { useState } from 'react';
import { register } from '../../utils/api';
import { validatePassword, validateEmail } from '../../utils/validation';
import LoadingSpinner from '../LoadingSpinner';

interface RegisterFormProps {
    onSubmit: (name: string, email: string, password: string) => Promise<void>;
    onToggleForm: () => void;
}

export default function RegisterForm({ onSubmit, onToggleForm }: RegisterFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        // Validate inputs
        const passwordErrors = validatePassword(password);
        const emailErrors = validateEmail(email);
        const allErrors = [...passwordErrors, ...emailErrors];

        if (allErrors.length > 0) {
            setErrors(allErrors);
            return;
        }
        
        setIsLoading(true);
        try {
            await onSubmit(name, email, password);
            setErrors([]);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
            {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-700 text-sm">{error}</p>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-[1px] border-[#d1d5db] rounded-md px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors([]);
                        }}
                        className="mt-1 block w-full border-[1px] border-[#d1d5db] rounded-md px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors([]);
                        }}
                        className="mt-1 block w-full border-[1px] border-[#d1d5db] rounded-md px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium flex justify-center items-center ${
                        isLoading 
                            ? 'bg-primary-400 cursor-not-allowed' 
                            : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="small" />
                            <span className="ml-2">Creating account...</span>
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={onToggleForm}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign In
                </button>
            </p>
        </div>
    );
}
