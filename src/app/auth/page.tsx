import AuthForm from '@/components/custom/AuthForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />
      
      <div className="w-full max-w-md relative">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#100e06]/70 hover:text-[#100e06] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Main auth container */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 items-center flex flex-col shadow-lg border border-[#ebd98d]/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#100e06] mb-2">
              Welcome to <span className="text-[#d2b53b]">RoomMate</span>
            </h1>
            <p className="text-[#100e06]/70">
              Sign in to find your perfect roommate
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm />

          {/* Footer text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#100e06]/60">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Additional info */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-[#100e06]/50">
            Need help? Contact our support team
          </p>
        </div> */}
      </div>
    </div>
  )
}
