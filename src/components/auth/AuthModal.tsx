import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { LoginForm } from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { useAuth } from "@/context/AuthContext"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(defaultView)
  const { error } = useAuth()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {view === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {view === "login"
              ? "Enter your credentials to access your account"
              : "Sign up for a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        {view === "login" ? (
          <LoginForm
            onSuccess={onClose}
            onRegisterClick={() => setView("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={onClose}
            onLoginClick={() => setView("login")}
          />
        )}

        {error && (
          <div className="text-sm text-red-500 mt-2">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
