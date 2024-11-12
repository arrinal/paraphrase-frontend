import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from "@/types/user";
import { login as loginApi, register as registerApi } from "@/utils/api";
import { useToast } from "./ToastContext";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        // Check for existing auth on mount
        const token = localStorage.getItem(TOKEN_KEY);
        const userData = localStorage.getItem(USER_KEY);

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Failed to parse user data:", e);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const handleAuthResponse = ({ token, refresh_token, user }: AuthResponse) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setUser(user);
        setError(null);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await loginApi(email, password);
            if (response.error) {
                showToast(response.error, "error");
                return false;
            }
            handleAuthResponse(response);
            showToast("Successfully logged in", "success");
            if (window.location.pathname === '/pricing') {
                window.location.reload();
              }
            return true;
        } catch (error) {
            showToast("An error occurred during login", "error");
            return false;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            const response = await registerApi(name, email, password);
            if (response.error) {
                showToast(response.error, "error");
                return false;
            }
            handleAuthResponse(response);
            showToast("Successfully registered", "success");
            if (window.location.pathname === '/pricing') {
                window.location.reload();
              }
            window.location.reload();
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to register";
            setError(message);
            showToast(message, "error");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        showToast("Successfully logged out", "success");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
