import { Plan } from "@/types/subscription"

export const MAX_TEXT_LENGTH = 1000

export const SUPPORTED_LANGUAGES = [
  { value: "auto", label: "Auto-Detect" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
] as const

export const PARAPHRASE_STYLES = [
  { value: "standard", label: "Standard" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "creative", label: "Creative" },
  { value: "professional", label: "Professional" },
] as const

export const API_ROUTES = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  VERIFY: "/api/auth/verify",
  PARAPHRASE: "/api/paraphrase",
  HISTORY: "/api/history",
  STATS: "/api/stats",
  SETTINGS: "/api/settings",
  LANGUAGES: "/api/languages",
} as const

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    iosProductId: 'com.frazai.basic',
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 1,000 characters per request',
      '50 requests per day',
      'Standard paraphrasing styles',
    ],
    limits: {
      charactersPerRequest: 1000,
      requestsPerDay: 50,
      bulkParaphrase: false,
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 19.99,
    iosProductId: 'com.frazai.pro',
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5,000 characters per request',
      'Unlimited requests',
      'All paraphrasing styles',
      'Bulk paraphrasing',
    ],
    limits: {
      charactersPerRequest: 5000,
      requestsPerDay: -1, // unlimited
      bulkParaphrase: true,
    },
  },
]; 