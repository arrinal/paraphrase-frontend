import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken, isTokenExpired } from '../utils/auth';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Only run after component is mounted (client-side)
    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (!token || isTokenExpired(token)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Session expired');
                }

                const data = await response.json();
                setUser(data.user);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                localStorage.setItem('user', JSON.stringify(data.user));
            } catch (error) {
                console.error('Session verification failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [mounted]);

    useEffect(() => {
        if (!mounted || !user) return;

        // Check token every minute
        const tokenCheckInterval = setInterval(async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return;
            }

            if (isTokenExpired(token)) {
                const newToken = await refreshToken();
                if (!newToken) {
                    setUser(null);
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(tokenCheckInterval);
    }, [mounted, user]);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid email or password');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred during login';
            setError(message);
            throw new Error(message);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred during registration';
            setError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setUser(null);
    };

    // Don't render children until after first mount to prevent hydration errors
    if (!mounted) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
