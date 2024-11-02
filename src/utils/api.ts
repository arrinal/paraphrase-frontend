import { User } from "@/types/user"
import { Subscription } from "@/types/subscription"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

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
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
  const response = await fetch(`${API_BASE_URL}/api/settings`, {
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
  const response = await fetch(`${API_BASE_URL}/api/paraphrase`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ text, language, style }),
  })
  return handleResponse(response)
}

export async function getUserStats() {
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
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
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    headers: getHeaders(),
  });
  const data = await handleResponse(response) as HistoryResponse;
  return data.history || [];
}

export async function getUsedLanguages(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/languages`, {
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscription`, {
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

export async function createCheckoutSession(planId: string, isIOS: boolean = false) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout/session`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        planId,
        platform: isIOS ? 'ios' : 'web'
      }),
    });
    
    // If endpoint doesn't exist yet, return mock response
    if (response.status === 404) {
      return { url: '#' }; // Mock response until backend is ready
    }
    
    return handleResponse(response);
  } catch (error) {
    console.warn('Checkout endpoint not implemented yet:', error);
    return { url: '#' };
  }
}

export async function cancelSubscription() {
  const response = await fetch(`${API_BASE_URL}/api/subscription/cancel`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
}
