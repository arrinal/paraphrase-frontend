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
        <div className="container py-4 flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            {new Date().getFullYear()} Fraz AI
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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
