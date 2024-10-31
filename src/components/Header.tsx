import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthModal from './auth/AuthModal';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

export default function Header() {
    const { user, logout, error } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    // Show error toast when auth error occurs
    useEffect(() => {
        if (error) {
            setToast({ message: error, type: 'error' });
        }
    }, [error]);

    const handleLogout = () => {
        logout();
        setToast({ message: 'Successfully logged out', type: 'success' });
        router.push('/');
    };

    const isActive = (path: string) => router.pathname === path;

    return (
        <>
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="text-2xl font-bold text-primary-600">
                                Paraphrase AI
                            </Link>
                            {user && (
                                <div className="flex space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            isActive('/dashboard')
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:text-primary-600'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/paraphrase"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            isActive('/paraphrase')
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:text-primary-600'
                                        }`}
                                    >
                                        Paraphrase
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            isActive('/settings')
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:text-primary-600'
                                        }`}
                                    >
                                        Settings
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-600">Welcome, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-primary-600"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
            <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
            {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
