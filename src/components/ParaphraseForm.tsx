import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader2, Copy, Check } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { paraphraseText } from "@/utils/api"
import { SUPPORTED_LANGUAGES, PARAPHRASE_STYLES } from "@/utils/constants"
import { MultiColumnSelect } from "./MultiColumnSelect"
import { getOrderedLanguages } from "@/utils/language-utils"

const MAX_CHARS = 10000

interface ParaphraseFormProps {
  onParaphraseComplete?: () => void
}

interface ParaphraseResponse {
  paraphrased: string;
  language: string;
  history_id: number;
}

export default function ParaphraseForm({ onParaphraseComplete }: ParaphraseFormProps) {
  const [text, setText] = useState("")
  const [language, setLanguage] = useState("auto")
  const [style, setStyle] = useState("standard")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<"original" | "paraphrased" | null>(null)
  const { user } = useAuth()
  const [orderedLanguages, setOrderedLanguages] = useState(SUPPORTED_LANGUAGES)

  useEffect(() => {
    // Fetch user's country code
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country_code;
        const ordered = getOrderedLanguages(countryCode);
        setOrderedLanguages(ordered as any);
      })
      .catch(err => {
        console.error('Failed to get country:', err);
        // Fallback to default ordering with English as second language
        setOrderedLanguages(getOrderedLanguages('') as any);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isLoading || !text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response: ParaphraseResponse = await paraphraseText(text, language, style)
      setResult(response.paraphrased)
      
      if (onParaphraseComplete) {
        onParaphraseComplete()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to paraphrase text")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, type: "original" | "paraphrased") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
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
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Enter your text here..."
                className="min-h-[200px] resize-none"
                required
              />
              <p className="text-sm text-muted-foreground text-right">
                {text.length}/{MAX_CHARS} characters
              </p>
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <MultiColumnSelect
                value={language}
                onValueChange={setLanguage}
                languages={orderedLanguages}
              />
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={style}
                onValueChange={setStyle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {PARAPHRASE_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
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
