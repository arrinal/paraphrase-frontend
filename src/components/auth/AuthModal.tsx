import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../context/AuthContext';
import Toast from '../Toast';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
            showToast('Successfully logged in!', 'success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to login';
            showToast(errorMessage, 'error');
        }
    };

    const handleRegister = async (name: string, email: string, password: string) => {
        try {
            await register(name, email, password);
            showToast('Successfully registered!', 'success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to register';
            showToast(errorMessage, 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
                {isLogin ? (
                    <LoginForm 
                        onSubmit={handleLogin} 
                        onToggleForm={() => setIsLogin(false)} 
                    />
                ) : (
                    <RegisterForm 
                        onSubmit={handleRegister} 
                        onToggleForm={() => setIsLogin(true)} 
                    />
                )}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
            {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
