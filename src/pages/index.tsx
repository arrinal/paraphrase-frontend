import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/router"
import Layout from "@/components/Layout"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      router.push("/paraphrase")
    } else {
      router.push("/paraphrase")
    }
  }

  return (
    <Layout>
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-primary">New</span>
                <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
                <a href="#" className="flex items-center gap-x-1">
                  See what's new
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Text with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the power of AI-driven text transformation. Our advanced paraphrasing tool helps you create unique, engaging content in seconds.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="text-base"
              >
                Get started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base"
                onClick={() => router.push("/features")}
              >
                Learn more <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative mx-auto w-[364px] max-w-full">
              {/* Add a nice illustration or animation here */}
              <div className="absolute -top-4 -right-4 -left-4 -bottom-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-2xl" />
              <div className="relative bg-white p-8 rounded-xl shadow-2xl ring-1 ring-gray-900/10">
                {/* Add your demo content here */}
                <div className="space-y-4">
                  <div className="h-2 w-20 bg-gray-200 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
