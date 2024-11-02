import React, { useState } from "react"
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
import { useActivity } from "@/hooks/useActivity"

const MAX_CHARS = 100000

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
  const { trackActivity } = useActivity()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isLoading || !text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response: ParaphraseResponse = await paraphraseText(text, language, style)
      setResult(response.paraphrased)
      
      await trackActivity("paraphrase", {
        textLength: text.length,
        language: response.language,
        style,
        timestamp: new Date().toISOString()
      })
      
      if (onParaphraseComplete) {
        onParaphraseComplete()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to paraphrase text")
      await trackActivity("paraphrase_error", {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      })
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
    <div className="space-y-8">
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
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-Detect</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full"
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

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Original Text</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(text, "original")}
              >
                {copied === "original" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {text}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paraphrased Text</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(result, "paraphrased")}
              >
                {copied === "paraphrased" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
