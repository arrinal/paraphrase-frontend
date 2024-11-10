import { User } from "@/types/user"
import { Subscription } from "@/types/subscription"
import { API_ROUTES } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return []
  }

  // Handle empty response
  const text = await response.text()
  if (!text) {
    return []
  }

  try {
    return JSON.parse(text)
  } catch {
    return []
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
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.SETTINGS}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

interface ParaphraseResponse {
  paraphrased: string;
  language: string;
  history_id: number;
}

export async function paraphraseText(
  text: string,
  language: string,
  style: string
): Promise<ParaphraseResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.PARAPHRASE}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ text, language, style }),
  })
  return handleResponse(response)
}

export async function getUserStats() {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.STATS}`, {
    headers: getHeaders(),
  })
  return handleResponse(response)
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
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.HISTORY}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse(response) as HistoryResponse;
  return data.history || [];
}

export async function getUsedLanguages(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.LANGUAGES}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.SUBSCRIPTION}`, {
      headers: getHeaders(),
    });
    
    // If endpoint doesn't exist yet, return null instead of throwing error
    if (response.status === 404) {
      return null;
    }
    
    return handleResponse(response);
  } catch (error) {
    console.warn('Subscription endpoint not implemented yet:', error);
    return null;
  }
}

export const createCheckoutSession = async (planId: string) => {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.CHECKOUT}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ 
      planId,
      platform: 'web'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
};

export async function cancelSubscription() {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.CANCEL_SUBSCRIPTION}`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export const activateTrialSubscription = async () => {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.SUBSCRIPTION}/trial`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to activate trial');
  }

  return response.json();
};
