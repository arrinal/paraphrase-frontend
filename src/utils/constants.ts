import { Plan } from "@/types/subscription"

export const MAX_TEXT_LENGTH = 1000

export const SUPPORTED_LANGUAGES = [
  { value: "auto", label: "Auto-Detect" },
  { value: "Afrikaans", label: "Afrikaans" },
  { value: "Chinese", label: "Chinese" },
  { value: "Danish", label: "Danish" },
  { value: "Dutch", label: "Dutch" },
  { value: "English", label: "English" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Hindi", label: "Hindi" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Italian", label: "Italian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Malay", label: "Malay" },
  { value: "Norwegian", label: "Norwegian" },
  { value: "Polish", label: "Polish" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Romanian", label: "Romanian" },
  { value: "Russian", label: "Russian" },
  { value: "Spanish", label: "Spanish" },
  { value: "Swedish", label: "Swedish" },
  { value: "Tagalog", label: "Tagalog" },
  { value: "Turkish", label: "Turkish" },
  { value: "Ukrainian", label: "Ukrainian" },
  { value: "Vietnamese", label: "Vietnamese" },
] as const

export const PARAPHRASE_STYLES = [
  { value: "standard", label: "Standard" },
  { value: "formal", label: "Formal" },
  { value: "academic", label: "Academic" },
  { value: "casual", label: "Casual" },
  { value: "creative", label: "Creative" },
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
      charactersPerRequest: -1, // unlimited
      requestsPerDay: -1, // unlimited
      bulkParaphrase: true,
    },
  },
]; 