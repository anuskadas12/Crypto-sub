"use client"

import type React from "react"

import { Shield, X, Mail, MessageCircle, Phone, MapPin, Send, Sparkles, Users, Lock, Moon, Sun } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isConnected: boolean
  userAddress: string
  activeTab: "explore" | "create" | "dashboard"
  setActiveTab: (tab: "explore" | "create" | "dashboard") => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function Navbar({
  isConnected,
  userAddress,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onConnect,
  onDisconnect,
}: NavbarProps) {
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [showAboutPopup, setShowAboutPopup] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle wallet connection without changing tabs
  const handleWalletConnect = (address: string) => {
    onConnect(address)
    // Wallet connects but stays on current page - no automatic navigation
  }

  const handleContactSubmit = () => {
    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all fields")
      return
    }

    // Here you would typically send the form data to your backend
    console.log("Contact form submitted:", contactForm)
    // Reset form and close popup
    setContactForm({ name: "", email: "", message: "" })
    setShowContactPopup(false)
    // You could add a success toast here
    alert("Thank you! Your message has been sent.")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="pt-8 px-4 sm:px-6 lg:px-8 flex justify-center">
        <nav
          className={`rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border backdrop-blur-md w-full max-w-4xl transition-all duration-500 ${
            isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="px-6 lg:px-8">
            <div className="flex justify-center items-center h-20 relative">
              {/* Left Section - Profile/Logo (Absolute positioned) */}
              <div className="absolute left-0 flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl ring-4 transition-all duration-500 ${
                      isDarkMode ? "ring-purple-900/50" : "ring-purple-100"
                    }`}
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold transition-all duration-500 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      CryptoSub
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Section - Navigation Links */}
              <div className="hidden lg:flex items-center space-x-8">
                {!isConnected ? (
                  // Default navigation for non-connected users
                  <>
                    <button
                      onClick={() => setShowAboutPopup(true)}
                      className={`font-semibold transition-all duration-200 hover:scale-105 ${
                        isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setShowContactPopup(true)}
                      className={`font-semibold transition-all duration-200 hover:scale-105 ${
                        isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      Contact
                    </button>
                  </>
                ) : (
                  // Connected user navigation
                  <>
                    <button
                      onClick={() => setActiveTab("explore")}
                      className={`font-semibold transition-all duration-200 hover:scale-105 ${
                        activeTab === "explore"
                          ? `border-b-2 border-purple-500 pb-1 shadow-sm ${isDarkMode ? "text-white" : "text-gray-900"}`
                          : `${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`
                      }`}
                    >
                      Explore
                    </button>
                    <button
                      onClick={() => setActiveTab("create")}
                      className={`font-semibold transition-all duration-200 hover:scale-105 ${
                        activeTab === "create"
                          ? `border-b-2 border-purple-500 pb-1 shadow-sm ${isDarkMode ? "text-white" : "text-gray-900"}`
                          : `${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`
                      }`}
                    >
                      Create Plan
                    </button>
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`font-semibold transition-all duration-200 hover:scale-105 ${
                        activeTab === "dashboard"
                          ? `border-b-2 border-purple-500 pb-1 shadow-sm ${isDarkMode ? "text-white" : "text-gray-900"}`
                          : `${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`
                      }`}
                    >
                      Dashboard
                    </button>
                  </>
                )}
              </div>

              {/* Right Section - Theme Toggle & Connect Wallet (Absolute positioned) */}
              <div className="absolute right-0 flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
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
                        : `shadow-sm ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`
                    }`}
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === "create"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                        : `shadow-sm ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`
                    }`}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === "dashboard"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                        : `shadow-sm ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`
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

      {/* About Us Popup Modal */}
      {showAboutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAboutPopup(false)}
          ></div>

          {/* Modal */}
          <div
            className={`relative rounded-3xl shadow-2xl max-w-md w-full mx-auto animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ${
              isDarkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAboutPopup(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 z-10 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header with animated elements */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-t-3xl p-4 text-center relative overflow-hidden">
              {/* Floating particles - only show in dark mode */}
              {isDarkMode && (
                <>
                  <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce"></div>
                  <div className="absolute top-6 right-6 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-6 w-1 h-1 bg-white/25 rounded-full animate-pulse"></div>
                </>
              )}

              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Sparkles className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1 animate-in slide-in-from-top duration-500">
                About CryptoSub
              </h2>
              {!isDarkMode && (
                <p className="text-purple-100 text-sm animate-in slide-in-from-top duration-700">
                  Revolutionizing subscriptions with blockchain
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              {/* Main description */}
              <div className="mb-4 animate-in slide-in-from-bottom duration-500">
                <p className={`leading-relaxed text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  CryptoSub makes managing subscriptions easy and secure with blockchain technology. Create flexible
                  subscription plans, accept crypto payments, and give your subscribers full control over their
                  recurring payments.
                  <span className="text-purple-600 font-semibold"> Simple, transparent, and decentralized! </span>
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div
                  className={`flex items-center justify-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-left duration-700 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-purple-50 to-blue-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-purple-900/50" : "bg-purple-100"}`}>
                    <Lock className={`h-4 w-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Secure & Transparent
                    </p>
                    {!isDarkMode && <p className="text-xs text-gray-600">Blockchain-powered security you can trust</p>}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-right duration-700 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-green-50 to-emerald-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-green-900/50" : "bg-green-100"}`}>
                    <Users className={`h-4 w-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Easy to Use
                    </p>
                    {!isDarkMode && <p className="text-xs text-gray-600">Simple setup for creators and subscribers</p>}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-left duration-900 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-orange-50 to-red-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-orange-900/50" : "bg-orange-100"}`}>
                    <Sparkles className={`h-4 w-4 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Flexible Plans
                    </p>
                    {!isDarkMode && <p className="text-xs text-gray-600">Create custom subscription models</p>}
                  </div>
                </div>
              </div>

              {/* Fun call-to-action */}
              <div className="animate-in slide-in-from-bottom duration-1000">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                  <p className="font-bold text-base mb-1">Ready to get started? 🚀</p>
                  {!isDarkMode && (
                    <p className="text-purple-100 text-xs">
                      Connect your wallet and explore the future of subscriptions!
                    </p>
                  )}
                </div>
              </div>

              {/* Fun footer with emoji */}
              {!isDarkMode && (
                <div className="mt-4 animate-in slide-in-from-bottom duration-1200">
                  <p className="text-xs text-gray-500">🌟 Built with ❤️ for the decentralized web 🌟</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Popup Modal */}
      {showContactPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowContactPopup(false)}
          ></div>

          {/* Modal */}
          <div
            className={`relative rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ${
              isDarkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowContactPopup(false)}
              className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors duration-200 z-10 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-4 text-center relative overflow-hidden">
              {/* Floating particles - only show in dark mode */}
              {isDarkMode && (
                <>
                  <div className="absolute top-2 left-4 w-1 h-1 bg-white/30 rounded-full animate-bounce"></div>
                  <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute bottom-2 left-6 w-0.5 h-0.5 bg-white/25 rounded-full animate-pulse"></div>
                </>
              )}

              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Contact Us</h2>
              {!isDarkMode && <p className="text-purple-100 text-sm">We'd love to hear from you! 💬</p>}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* App Info Section */}
              <div
                className={`text-center rounded-xl p-3 animate-in slide-in-from-bottom duration-500 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-purple-50 to-blue-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className={`h-5 w-5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                  <span className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>CryptoSub</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Revolutionary blockchain-powered subscription management platform.
                  <span className={`font-medium ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                    {" "}
                    Secure, transparent & decentralized! 🚀
                  </span>
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] animate-in slide-in-from-left duration-600 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-blue-50 to-indigo-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-900/50" : "bg-blue-100"}`}>
                    <Mail className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Email Support
                    </p>
                    {!isDarkMode && <p className="text-xs text-blue-600 font-medium">hello@cryptosub.com</p>}
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] animate-in slide-in-from-right duration-700 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-green-50 to-emerald-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDarkMode ? "bg-green-900/50" : "bg-green-100"}`}>
                    <Phone className={`h-4 w-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Phone Support
                    </p>
                    {!isDarkMode && <p className="text-xs text-green-600 font-medium">+1 (555) 123-4567</p>}
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] animate-in slide-in-from-left duration-800 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-r from-orange-50 to-red-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDarkMode ? "bg-orange-900/50" : "bg-orange-100"}`}>
                    <MapPin className={`h-4 w-4 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Office Location
                    </p>
                    {!isDarkMode && <p className="text-xs text-orange-600 font-medium">San Francisco, CA</p>}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-3 animate-in slide-in-from-bottom duration-900">
                <h3 className={`text-sm font-semibold text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Send us a message ✉️
                </h3>

                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "border-gray-200 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "border-gray-200 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "border-gray-200 placeholder-gray-400"
                    }`}
                  />
                </div>

                <button
                  onClick={handleContactSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>

              {/* Fun Footer */}
              {!isDarkMode && (
                <div className="text-center pt-2 border-t border-gray-100 animate-in slide-in-from-bottom duration-1000">
                  <p className="text-xs text-gray-500">⚡ Quick response guaranteed! Usually within 2-4 hours 🚀</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className="text-xs">🌟</span>
                    <span className="text-xs text-purple-600 font-medium">Built for the decentralized future</span>
                    <span className="text-xs">🌟</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
