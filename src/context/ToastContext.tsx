import React, { createContext, useContext, useState } from "react"
import {
  Toast,
  ToastProvider as ToastPrimitive,
  ToastViewport,
} from "@/components/ui/toast"

type ToastType = {
  message: string
  type: "success" | "error"
  id: number
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { message, type, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.type === "error" ? "destructive" : "default"}
          >
            <p>{toast.message}</p>
          </Toast>
        ))}
        <ToastViewport />
      </ToastPrimitive>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 