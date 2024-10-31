import { jwtDecode } from "jwt-decode";  // Update import syntax

interface DecodedToken {
    exp: number;
    user_id: number;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);  // Use jwtDecode instead of jwt_decode
        return decoded.exp * 1000 < Date.now() + (5 * 60 * 1000);
    } catch {
        return true;
    }
};

export const refreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch('http://localhost:8080/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to refresh token');

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
};

export const getAuthToken = async (): Promise<string | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (isTokenExpired(token)) {
        return await refreshToken();
    }

    return token;
};
