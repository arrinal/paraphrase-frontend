import { useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"

export function useActivity() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const trackActivity = useCallback(
    async (action: string, metadata: Record<string, any> = {}) => {
      if (!user) return

      try {
        const response = await fetch("/api/activity/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            metadata,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to track activity")
        }
      } catch (error) {
        console.error("Activity tracking failed:", error)
        showToast("Failed to track activity", "error")
      }
    },
    [user, showToast]
  )

  return { trackActivity }
}
