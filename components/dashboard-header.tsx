"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, RefreshCw, Bell, Plus, Menu, X, LogOut } from "lucide-react"

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-jefferson-deep-blue border-b border-jefferson-bright-blue/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Image
              src="/images/jefferson-logo.png"
              alt="Thomas Jefferson University"
              width={50}
              height={50}
              className="rounded md:w-[60px] md:h-[60px]"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-serif font-bold text-white">
                <span className="hidden sm:inline">Calibration Equipment Tracker</span>
                <span className="sm:hidden">Equipment Tracker</span>
              </h1>
              <p className="text-jefferson-bright-blue text-xs md:text-sm">
                <span className="hidden md:inline">Medical Physics Division • Radiation Oncology Department</span>
                <span className="md:hidden">Medical Physics • Radiation Oncology</span>
              </p>
              <p className="text-silver text-xs hidden md:block">Home of Sidney Kimmel Medical College</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <span className="absolute -top-1 -right-1 bg-academic-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </Button>
            <Button
              size="sm"
              className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-academic-red text-academic-red hover:bg-academic-red hover:text-white"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Logout"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-jefferson-bright-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-jefferson-bright-blue/20">
            <div className="flex flex-col space-y-2">
              <Link href="/admin" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue"
                onClick={() => {
                  window.location.reload()
                  setIsMobileMenuOpen(false)
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <span className="absolute top-1 right-2 bg-academic-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Button>
              <Button
                size="sm"
                className="w-full justify-start bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent border-academic-red text-academic-red hover:bg-academic-red hover:text-white"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Logout"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
