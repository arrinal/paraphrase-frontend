import React, { useState } from 'react';
import { login } from '../../utils/api';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    onToggleForm: () => void;
}

export default function LoginForm({ onSubmit, onToggleForm }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return; // Prevent double submission
        
        setIsLoading(true);
        try {
            await onSubmit(email, password);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border-[1px] border-[#d1d5db] rounded-md px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                        isLoading 
                            ? 'bg-primary-400 cursor-not-allowed' 
                            : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                    onClick={onToggleForm}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
}
