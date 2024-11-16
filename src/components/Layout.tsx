import React from "react"
import Header from "./Header"
import Link from "next/link"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="border-t">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fraz AI
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Notice
            </Link>
            <Link href="/refund" className="hover:text-foreground">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
