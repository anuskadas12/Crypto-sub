"use client"

import type React from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, Zap, Users, ArrowRight, Check, Upload, X, Play } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet"
import { CreatePlanModal } from "@/components/create-plan-modal"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { UserDashboard } from "@/components/user-dashboard"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"explore" | "create" | "dashboard">("explore")
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [showVideoModal, setShowVideoModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setIsConnected(true)
            setUserAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  const handleVideoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setUploadedVideo(file)
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
      setShowVideoModal(true)
    } else {
      alert("Please select a valid video file.")
    }
  }

  const closeVideoModal = () => {
    setShowVideoModal(false)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview("")
    }
    setUploadedVideo(null)
  }

  const features = [
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Crypto Payments",
      description: "Accept USDC, DAI, and other stablecoins for your subscriptions",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automatic Billing",
      description: "Smart contracts handle recurring payments automatically",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "NFT Membership",
      description: "Subscribers get unique NFT passes as proof of membership",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Creator Friendly",
      description: "Low fees and instant payouts to content creators",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "2.5%",
      description: "Perfect for individual creators",
      features: ["Unlimited subscription plans", "NFT membership passes", "Basic analytics", "Email support"],
    },
    {
      name: "Pro",
      price: "1.5%",
      description: "For growing businesses",
      features: ["Everything in Starter", "Advanced analytics", "Custom branding", "Priority support", "API access"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

      {/* Video Preview Modal */}
      {showVideoModal && uploadedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <Play className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-lg">Video Preview</h3>
                  <p className="text-sm text-gray-600">{uploadedVideo.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeVideoModal} className="hover:bg-gray-100">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <video src={videoPreview} controls className="w-full max-h-[60vh] rounded-lg" preload="metadata">
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Demo: How this would work with CryptoSub</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your video would be uploaded to IPFS for decentralized storage</li>
                  <li>• Subscribers with valid NFT passes can access premium content</li>
                  <li>• Smart contracts automatically handle access control</li>
                  <li>• Creators earn crypto payments instantly</li>
                </ul>
              </div>
              <div className="flex gap-3 mt-4">
                <Button className="flex-1" onClick={closeVideoModal}>
                  Create Subscription Plan
                </Button>
                <Button variant="outline" onClick={closeVideoModal}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        isConnected={isConnected}
        userAddress={userAddress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConnect={(address) => {
          setIsConnected(true)
          setUserAddress(address)
        }}
        onDisconnect={() => {
          setIsConnected(false)
          setUserAddress("")
          setActiveTab("explore")
        }}
      />

      {/* Hero Section */}
      {!isConnected && (
        <section className="relative py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800">
                🚀 The Future of Subscriptions
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                <span className="block">Smart Contract</span>
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Subscription Platform
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Create crypto-powered subscriptions with automatic billing and NFT membership passes. Perfect for Web3
                creators, SaaS tools, and exclusive communities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <ConnectWallet
                isConnected={isConnected}
                userAddress={userAddress}
                onConnect={(address) => {
                  setIsConnected(true)
                  setUserAddress(address)
                }}
                onDisconnect={() => {
                  setIsConnected(false)
                  setUserAddress("")
                }}
                size="lg"
              />
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-gray-700 hover:bg-gray-50"
                onClick={handleVideoUpload}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Demo Video
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$2.5M+</div>
                <div className="text-gray-600">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Creators</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Connected User Content */}
      {isConnected && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === "explore" && <SubscriptionPlans userAddress={userAddress} />}
          {activeTab === "create" && <CreatePlanModal userAddress={userAddress} />}
          {activeTab === "dashboard" && <UserDashboard userAddress={userAddress} />}
        </div>
      )}

      {/* Features Section */}
      {!isConnected && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CryptoSub?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built for the Web3 era with smart contracts, NFTs, and seamless crypto payments
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {!isConnected && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Only pay when you earn. No monthly fees, no hidden costs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? "border-purple-500 shadow-xl scale-105" : "border-gray-200"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{plan.price}</div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CryptoSub</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The future of subscriptions is here. Create, manage, and monetize your content with crypto-powered
                subscriptions and NFT memberships.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CryptoSub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
