import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: await getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to login');
    }

    return response.json();
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
    }

    return response.json();
}

const getHeaders = async () => {
    const token = await getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const paraphraseText = async (text: string, language: string, style: string): Promise<string> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/paraphrase`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ text, language, style }),
    });

    if (!response.ok) {
        throw new Error('Failed to paraphrase text');
    }

    const data = await response.json();
    return data.paraphrased;
};

// Add this interface
interface ParaphraseHistory {
    id: number;
    user_id: number;
    original_text: string;
    paraphrased_text: string;
    language: string;
    style: string;
    created_at: string;
}

// Add this function
export const getParaphraseHistory = async (): Promise<ParaphraseHistory[]> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/history`, {
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }

    const data = await response.json();
    return data.history;
};

// Add this function
export const getUsedLanguages = async (): Promise<string[]> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/languages`, {
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch languages');
    }

    const data = await response.json();
    return data.languages;
};

// Add these interfaces and functions to your existing api.ts

interface UserStats {
    totalParaphrases: number;
    languageBreakdown: { [key: string]: number };
    styleBreakdown: { [key: string]: number };
    dailyUsage: { date: string; count: number }[];
}

interface UpdateSettingsRequest {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}

// Get user stats
export const getUserStats = async (): Promise<UserStats> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user stats');
    }

    return response.json();
};

// Update user settings
export const updateUserSettings = async (data: UpdateSettingsRequest): Promise<void> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
    }
};

// Add this to track usage
export const trackUsage = async (action: string, metadata?: any): Promise<void> => {
    const headers = await getHeaders();
    await fetch(`${API_BASE_URL}/api/track`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ action, metadata }),
    });
};
