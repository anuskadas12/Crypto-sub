"use client"

import { Shield } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet"
import { useState } from "react"

interface NavbarProps {
  isConnected: boolean
  userAddress: string
  activeTab: "explore" | "create" | "dashboard"
  setActiveTab: (tab: "explore" | "create" | "dashboard") => void
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function Navbar({ isConnected, userAddress, activeTab, setActiveTab, onConnect, onDisconnect }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle wallet connection without changing tabs
  const handleWalletConnect = (address: string) => {
    onConnect(address)
    // Wallet connects but stays on current page - no automatic navigation
  }



  return (
    <div className="pt-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <nav className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-gray-100 backdrop-blur-md w-full max-w-4xl">
        <div className="px-6 lg:px-8">
          <div className="flex justify-center items-center h-20 relative">
            {/* Left Section - Profile/Logo (Absolute positioned) */}
            <div className="absolute left-0 flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-purple-100">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">CryptoSub</span>
                </div>
              </div>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {!isConnected ? (
                // Default navigation for non-connected users
                <>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-all duration-200 font-semibold hover:scale-105"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-all duration-200 font-semibold hover:scale-105"
                  >
                    Contact
                  </a>
                </>
              ) : (
                // Connected user navigation
                <>
                  <button
                    onClick={() => setActiveTab("explore")}
                    className={`font-semibold transition-all duration-200 hover:scale-105 ${
                      activeTab === "explore"
                        ? "text-gray-900 border-b-2 border-purple-500 pb-1 shadow-sm"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`font-semibold transition-all duration-200 hover:scale-105 ${
                      activeTab === "create"
                        ? "text-gray-900 border-b-2 border-purple-500 pb-1 shadow-sm"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Create Plan
                  </button>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`font-semibold transition-all duration-200 hover:scale-105 ${
                      activeTab === "dashboard"
                        ? "text-gray-900 border-b-2 border-purple-500 pb-1 shadow-sm"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Dashboard
                  </button>
                </>
              )}
            </div>

            {/* Right Section - Connect Wallet (Absolute positioned) */}
            <div className="absolute right-0 flex items-center space-x-4">
              <ConnectWallet
                isConnected={isConnected}
                userAddress={userAddress}
                onConnect={handleWalletConnect}
                onDisconnect={onDisconnect}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isConnected && (
            <div className="lg:hidden pb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("explore")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === "explore"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === "create"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  Create
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}