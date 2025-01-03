import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useSubscription } from "@/context/SubscriptionContext"
import { paraphraseText } from "@/utils/api"
import { SUPPORTED_LANGUAGES, PARAPHRASE_STYLES, PLAN_LIMITS } from "@/utils/constants"
import { MultiColumnSelect } from "./MultiColumnSelect"
import { getOrderedLanguages } from "@/utils/language-utils"
import { useToast } from "@/context/ToastContext"

interface ParaphraseFormProps {
  onParaphraseComplete?: () => void
}

export default function ParaphraseForm({ onParaphraseComplete }: ParaphraseFormProps) {
  const [text, setText] = useState("")
  const { subscription } = useSubscription()
  const isTrial = subscription?.plan_id === 'trial'
  const [language, setLanguage] = useState('English') // Always start with English
  const [style, setStyle] = useState("standard")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [orderedLanguages, setOrderedLanguages] = useState(getOrderedLanguages(''))
  const { user } = useAuth()
  const { showToast } = useToast()
  const [hasInitialized, setHasInitialized] = useState(false)

  // Set initial language based on subscription type and IP
  useEffect(() => {
    if (!subscription) return; // Wait for subscription data

    if (!hasInitialized) {
      if (!isTrial) {
        // Only for pro users, try to detect language from IP
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            const countryCode = data.country_code;
            const ordered = getOrderedLanguages(countryCode);
            setOrderedLanguages(ordered);
            setLanguage(ordered[0].value);
          })
          .catch(() => {
            const defaultOrdered = getOrderedLanguages('');
            setOrderedLanguages(defaultOrdered);
            setLanguage('auto')
          })
      }
      setHasInitialized(true)
    }
  }, [subscription, isTrial, hasInitialized])

  // Force English for trial users if they somehow select a different language
  useEffect(() => {
    if (isTrial && language !== 'English') {
      setLanguage('English')
    }
  }, [isTrial, language])

  // Custom setLanguage function
  const handleLanguageChange = (newLanguage: string) => {
    if (isTrial && newLanguage !== 'English') {
      setLanguage('English')
    } else {
      setLanguage(newLanguage)
    }
  }

  const availableLanguages = orderedLanguages.map(lang => ({
    ...lang,
    disabled: isTrial && lang.value !== 'English'
  }))

  const availableStyles = PARAPHRASE_STYLES.map(style => ({
    ...style,
    disabled: isTrial && style.value !== 'standard'
  }))

  // Get max characters based on subscription
  const maxCharacters = subscription?.plan_id === 'trial' 
    ? PLAN_LIMITS.trial.maxCharacters 
    : PLAN_LIMITS.pro.maxCharacters

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isLoading || !text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await paraphraseText(text, language, style);
      
      if ('error' in result) {
        showToast(result.error, 'error');
      } else {
        setResult(result.paraphrased);
      }
      if (onParaphraseComplete) {
        onParaphraseComplete()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to paraphrase text")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Text to Paraphrase</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxCharacters))}
              placeholder="Enter your text here..."
              className="min-h-[200px] resize-none"
              required
            />
            <p className="text-sm text-muted-foreground text-right">
              {text.length}/{maxCharacters} characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={language}
                onValueChange={handleLanguageChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-3 gap-2">
                    {availableLanguages.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        disabled={lang.disabled}
                        className={lang.disabled ? 'text-muted-foreground' : ''}
                      >
                        {lang.label}
                        {lang.disabled && isTrial && ' (Pro)'}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={style}
                onValueChange={setStyle}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                    {availableStyles.map((style) => (
                      <SelectItem
                        key={style.value}
                        value={style.value}
                        disabled={style.disabled}
                        className={style.disabled ? 'text-muted-foreground' : ''}
                      >
                        {style.label}
                        {style.disabled && isTrial && ' (Pro)'}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Paraphrasing...
              </>
            ) : (
              "Paraphrase"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
