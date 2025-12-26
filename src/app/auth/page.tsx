import AuthForm from "@/components/custom/AuthForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#fbf9f1] flex flex-col lg:flex-row relative overflow-hidden w-screen left-[calc(-50vw+50%)]">
      {/* Abstract Background Shapes - Animated and Responsive */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-[#ebd98d]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vh] h-[40vh] bg-[#d2b53b]/10 rounded-full blur-[80px]" />

      {/* Left Panel - Visual/Brand Area (Hidden on mobile/small screens for cleaner auth focus) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative z-10">
        <div className="max-w-lg">
          <div className="inline-block p-4 rounded-2xl bg-white/40 backdrop-blur-md mb-8 border border-white/50 shadow-sm"></div>
          <h1 className="text-5xl font-bold text-[#100e06] leading-tight mb-6">
            Find your perfect <span className="text-[#d2b53b]">roomie</span>{" "}
            today.
          </h1>
          <p className="text-lg text-[#100e06]/70 leading-relaxed">
            Join our community of verified roommates. Connect, chat, and find a
            place called home with people you trust.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 bg-white/30 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none h-screen sm:h-auto lg:h-screen">
        <div className="w-full max-w-sm mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#100e06]/60 hover:text-[#d2b53b] transition-colors mb-8 group font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 ring-1 ring-[#ebd98d]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ebd98d] via-[#d2b53b] to-[#ebd98d]" />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#100e06] mb-2 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[#100e06]/60 text-sm">
                Sign in to continue your search
              </p>
            </div>

            <AuthForm />

            <div className="mt-8 pt-6 border-t border-[#100e06]/5">
              <p className="text-center text-xs text-[#100e06]/40 leading-relaxed">
                By continuing, you simply agree to our{" "}
                <br className="hidden sm:block" />
                <span className="font-medium underline cursor-pointer hover:text-[#d2b53b] transition-colors">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-medium underline cursor-pointer hover:text-[#d2b53b] transition-colors">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
