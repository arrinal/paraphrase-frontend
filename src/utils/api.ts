import { User } from "@/types/user"
import { Subscription } from "@/types/subscription"
import { API_ROUTES } from './constants';
import { isTokenExpired } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add subscribers waiting for the new token
function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

// Function to notify all subscribers with new token
function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

// Keep handleResponse simple and generic
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    return error // Return the error object instead of throwing
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  // Handle empty response
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Helper function to get headers with proper typing
function getHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

async function refreshAuthToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        // No refresh token, clear auth and redirect to index
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/';  // Redirect to index page
        return null;
    }

    try {
        // If already refreshing, wait for it to complete
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((token: string) => {
                    resolve(token);
                });
            });
        }

        isRefreshing = true;
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        // Check if refresh token is invalid (401) or other errors
        if (!response.ok) {
            // Clear auth data and redirect to index
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
            window.location.href = '/';  // Redirect to index page
            return null;
        }

        const { token } = await response.json();
        localStorage.setItem('auth_token', token);
        
        // Notify all subscribers about the new token
        onTokenRefreshed(token);
        
        return token;
    } catch (error) {
        // If refresh fails for any reason, clear auth and redirect to index
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/';  // Redirect to index page
        return null;
    } finally {
        isRefreshing = false;
    }
}

async function fetchWithTokenRefresh(
    url: string,
    options: RequestInit
): Promise<Response> {
    let response = await fetch(url, options);

    if (response.status === 401) {
        const token = await refreshAuthToken();
        if (token) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };
            response = await fetch(url, options);
        } else {
          window.location.href = '/';  // Redirect to index page
        }
    }

    return response;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.LOGIN}`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.REGISTER}`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(response)
}

export async function updateUserSettings(data: {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}) {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.SETTINGS}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );
  const responseData = await handleResponse(response);
  if (!response.ok) {
    return null;
  }
  return responseData;
}

interface ParaphraseResponse {
  paraphrased: string;
  language: string;
  history_id: number;
}

interface ErrorResponse {
  error: string;
}

export async function paraphraseText(
  text: string,
  language: string,
  style: string
): Promise<ParaphraseResponse | ErrorResponse> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.PARAPHRASE}`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ text, language, style }),
    }
  );

  const data = await handleResponse(response);

  // Check if the response contains an error
  if (data && 'error' in data) {
    // Handle the error as needed
    return { error: data.error }; // Return the error response
  }

  return data; // Return the successful response
}

export async function getUserStats() {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.STATS}`,
    { headers: getHeaders() }
  );
  const data = await handleResponse(response);
  if (!response.ok) {
    return null;
  }
  return data;
}

interface HistoryEntry {
  id: number;
  user_id: number;
  original_text: string;
  paraphrased_text: string;
  language: string;
  style: string;
  created_at: string;
}

interface HistoryResponse {
  history: HistoryEntry[];
}

export async function getParaphraseHistory(): Promise<HistoryEntry[]> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.HISTORY}`,
    { headers: getHeaders() }
  );
  const data = await handleResponse(response);
  if (!response.ok) {
    return [];
  }
  return data?.history || [];
}

export async function getUsedLanguages(): Promise<string[]> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.LANGUAGES}`,
    { headers: getHeaders() }
  );
  const data = await handleResponse(response);
  if (!response.ok) {
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getUserSubscription(): Promise<Subscription | null> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.SUBSCRIPTION}`,
    { headers: getHeaders() }
  );
  const data = await handleResponse(response);
  if (!response.ok || data?.error === "no active subscription found") {
    return null;
  }
  return data;
}

export const createCheckoutSession = async (planId: string) => {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.CHECKOUT}`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        planId,
        platform: 'web'
      }),
    }
  );
  const data = await handleResponse(response);
  if (!response.ok) {
    return null;
  }
  return data;
};

export async function cancelSubscription() {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.CANCEL_SUBSCRIPTION}`,
    {
      method: 'POST',
      headers: getHeaders(),
    }
  );
  const data = await handleResponse(response);
  if (!response.ok) {
    return null;
  }
  return data;
}

export const activateTrialSubscription = async () => {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}${API_ROUTES.SUBSCRIPTION}/trial`,
    {
      method: 'POST',
      headers: getHeaders(),
    }
  );
  const data = await handleResponse(response);
  return data;
};

export async function checkUserSubscription() {
    const response = await fetch(`${API_BASE_URL}/subscription/check`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
}
