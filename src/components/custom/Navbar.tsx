"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import NotificationBell from "./NotificationBell";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function NavbarWithAuth() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any | null>(null); // Use specific type if available
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = user
    ? [
        { name: "Preferences", link: "/preferences" },
        { name: "Match", link: "/match" },
        { name: "Chat History", link: "/chat/history" },
      ]
    : [];

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      setUser(session?.user || null);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during sign out:", error.message);
    } else {
      setUser(null);
      toast.success("Logged Out!");
      router.push("/auth");
    }
  };

  const siginRoute = () => {
    router.push("/auth");
  };

  const profileRoute = () => {
    router.push("/profile");
  };

  return (
    <div className="mt-5 relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            className="text-[#100e06]/80 hover:text-[#d2b53b]"
          />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell />
                <NavbarButton
                  onClick={profileRoute}
                  className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none font-medium"
                >
                  Profile
                </NavbarButton>
                <NavbarButton
                  onClick={handleLogout}
                  className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none"
                >
                  Logout
                </NavbarButton>
              </>
            ) : (
              <NavbarButton
                onClick={siginRoute}
                className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none"
              >
                Sign In
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader className="border-b border-[#ebd98d]/30">
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-white/95 backdrop-blur-sm border-[#ebd98d]/30"
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-[#100e06] hover:text-[#d2b53b] transition-colors"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4">
              {user ? (
                <>
                  <NotificationBell />
                  <NavbarButton
                    onClick={()=>{
                      profileRoute();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none font-medium"
                  >
                    Profile
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <NavbarButton
                  onClick={() => {
                    siginRoute();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white border-none"
                >
                  Sign In
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
