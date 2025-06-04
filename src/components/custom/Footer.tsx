import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-sm border-t border-[#ebd98d]/30 py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-[#100e06]/70">
          <span>Built by</span>
          <Link
            href="https://github.com/isayanpal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#d2b53b] hover:text-[#d2b53b]/80 font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            @isayanpal
          </Link>
          <span className="hidden sm:inline">•</span>
          <span>Follow on GitHub</span>
        </div>
      </div>
    </footer>
  )
}
