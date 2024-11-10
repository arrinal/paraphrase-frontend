import { Plan } from "@/types/subscription"

export const PLAN_LIMITS = {
  trial: {
    maxCharacters: 1000,
    maxRequests: 5,
  },
  pro: {
    maxCharacters: 10000,
    maxRequests: -1,
  },
} as const;

export const SUPPORTED_LANGUAGES = [
  { value: "English", label: "English" },
  { value: "auto", label: "Auto-Detect", proOnly: true },
  { value: "Afrikaans", label: "Afrikaans", proOnly: true },
  { value: "Chinese", label: "Chinese", proOnly: true },
  { value: "Danish", label: "Danish", proOnly: true },
  { value: "Dutch", label: "Dutch", proOnly: true },
  { value: "French", label: "French", proOnly: true },
  { value: "German", label: "German", proOnly: true },
  { value: "Hindi", label: "Hindi", proOnly: true },
  { value: "Indonesian", label: "Indonesian", proOnly: true },
  { value: "Italian", label: "Italian", proOnly: true },
  { value: "Japanese", label: "Japanese", proOnly: true },
  { value: "Malay", label: "Malay", proOnly: true },
  { value: "Norwegian", label: "Norwegian", proOnly: true },
  { value: "Polish", label: "Polish", proOnly: true },
  { value: "Portuguese", label: "Portuguese", proOnly: true },
  { value: "Romanian", label: "Romanian", proOnly: true },
  { value: "Russian", label: "Russian", proOnly: true },
  { value: "Spanish", label: "Spanish", proOnly: true },
  { value: "Swedish", label: "Swedish", proOnly: true },
  { value: "Tagalog", label: "Tagalog", proOnly: true },
  { value: "Turkish", label: "Turkish", proOnly: true },
  { value: "Ukrainian", label: "Ukrainian", proOnly: true },
  { value: "Vietnamese", label: "Vietnamese", proOnly: true },
] as const

export const PARAPHRASE_STYLES = [
  { value: "standard", label: "Standard" },
  { value: "formal", label: "Formal", proOnly: true },
  { value: "academic", label: "Academic", proOnly: true },
  { value: "casual", label: "Casual", proOnly: true },
  { value: "creative", label: "Creative", proOnly: true },
] as const

export const API_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify",
  PARAPHRASE: "/paraphrase",
  HISTORY: "/history",
  STATS: "/stats",
  SETTINGS: "/settings",
  LANGUAGES: "/languages",
  SUBSCRIPTION: "/subscription",
  CHECKOUT: "/checkout/session",
  CANCEL_SUBSCRIPTION: "/subscription/cancel",
} as const

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    price: 0,
    currency: 'USD',
    interval: 'once',
    features: [
      'Paraphrase in English only',
      'Standard paraphrasing style',
      '5 paraphrases with AI',
      '1000 characters per request',
    ],
    limits: {
      charactersPerRequest: PLAN_LIMITS.trial.maxCharacters,
      requestsPerDay: PLAN_LIMITS.trial.maxRequests,
      bulkParaphrase: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5,
    iosProductId: 'com.frazai.pro',
    currency: 'USD',
    interval: 'month',
    features: [
      'Paraphrase in any language (auto-detect)',
      'Paraphrase and translate at the same time',
      'Unlimited paraphrase with AI',
      'All paraphrasing styles',
    ],
    limits: {
      charactersPerRequest: PLAN_LIMITS.pro.maxCharacters,
      requestsPerDay: PLAN_LIMITS.pro.maxRequests,
      bulkParaphrase: true,
    },
  },
] as const 