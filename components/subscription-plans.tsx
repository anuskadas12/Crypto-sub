"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Clock, Users, Star, Zap, X, Check, TrendingUp, BookOpen, Shield, Calendar, DollarSign } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SubscriptionPlansProps {
  userAddress: string
}

interface Plan {
  id: number
  name: string
  description: string
  price: string
  duration: string
  paymentToken: string
  creator: string
  creatorName: string
  subscribers: number
  rating: number
  category: string
  featured: boolean
  features: string[]
  detailedDescription: string
  benefits: string[]
  nextPayment?: string
  totalEarnings?: string
  successRate?: string
}

export function SubscriptionPlans({ userAddress }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [subscribing, setSubscribing] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [planToSubscribe, setPlanToSubscribe] = useState<Plan | null>(null)

  // Enhanced mock data
  useEffect(() => {
    const mockPlans: Plan[] = [
      {
        id: 1,
        name: "Crypto Trading Signals",
        description: "Daily trading signals and market analysis for crypto traders",
        detailedDescription: "Get premium crypto trading signals with detailed technical analysis, risk management strategies, and real-time market insights. Our expert traders provide 3-5 high-quality signals daily with precise entry/exit points.",
        price: "29.99",
        duration: "Monthly",
        paymentToken: "USDC",
        creator: "0x1234...5678",
        creatorName: "CryptoTrader Pro",
        subscribers: 1250,
        rating: 4.8,
        category: "Trading",
        featured: true,
        features: [
          "3-5 daily trading signals",
          "Technical analysis reports",
          "Risk management guidance",
          "24/7 telegram support",
          "Weekly market outlook",
          "Stop-loss recommendations"
        ],
        benefits: [
          "Average 15% monthly returns",
          "85% success rate on signals",
          "Real-time notifications",
          "Educational content included"
        ],
        successRate: "85%",
        totalEarnings: "$2.1M",
        nextPayment: "2025-07-30"
      },
      {
        id: 2,
        name: "Web3 Development Course",
        description: "Complete course on building dApps and smart contracts",
        detailedDescription: "Master Web3 development with our comprehensive course covering Solidity, React, and blockchain integration. Build 5 real-world projects and get certified as a Web3 developer.",
        price: "99.99",
        duration: "Lifetime",
        paymentToken: "DAI",
        creator: "0x2345...6789",
        creatorName: "Web3 Academy",
        subscribers: 850,
        rating: 4.9,
        category: "Education",
        featured: true,
        features: [
          "50+ hours of video content",
          "5 hands-on projects",
          "Smart contract templates",
          "1-on-1 mentorship sessions",
          "Certificate of completion",
          "Lifetime access to updates"
        ],
        benefits: [
          "Build production-ready dApps",
          "Learn from industry experts",
          "Get job placement assistance",
          "Join exclusive developer community"
        ],
        successRate: "92%",
        totalEarnings: "Career boost",
        nextPayment: "One-time payment"
      },
      {
        id: 3,
        name: "NFT Art Collection Access",
        description: "Exclusive access to premium NFT drops and artist community",
        detailedDescription: "Join our exclusive NFT art community and get early access to premium drops, artist collaborations, and limited edition collections.",
        price: "15.00",
        duration: "Monthly",
        paymentToken: "USDC",
        creator: "0x3456...7890",
        creatorName: "ArtVault Collective",
        subscribers: 2100,
        rating: 4.6,
        category: "Art",
        featured: false,
        features: [
          "Early access to NFT drops",
          "Artist community chat",
          "Monthly exclusive releases",
          "Collector rewards program"
        ],
        benefits: [
          "Discover emerging artists",
          "Exclusive collection access",
          "Community voting rights",
          "Artist meet & greets"
        ]
      },
      {
        id: 4,
        name: "DeFi Yield Farming Guide",
        description: "Advanced strategies for maximizing DeFi yields safely",
        detailedDescription: "Learn advanced DeFi yield farming strategies with risk assessment, protocol analysis, and maximizing returns while minimizing impermanent loss.",
        price: "49.99",
        duration: "Monthly",
        paymentToken: "USDC",
        creator: "0x4567...8901",
        creatorName: "DeFi Maximalist",
        subscribers: 680,
        rating: 4.7,
        category: "DeFi",
        featured: false,
        features: [
          "Weekly yield opportunities",
          "Risk assessment tools",
          "Protocol deep dives",
          "APY tracking dashboard"
        ],
        benefits: [
          "Maximize farming yields",
          "Reduce impermanent loss",
          "Early protocol access",
          "Advanced strategies"
        ]
      },
      {
        id: 5,
        name: "Gaming Guild Membership",
        description: "Access to exclusive gaming tournaments and rewards",
        detailedDescription: "Join our gaming guild for exclusive tournaments, play-to-earn opportunities, and community events with valuable rewards.",
        price: "19.99",
        duration: "Monthly",
        paymentToken: "USDC",
        creator: "0x5678...9012",
        creatorName: "GameFi Guild",
        subscribers: 3200,
        rating: 4.5,
        category: "Gaming",
        featured: false,
        features: [
          "Weekly tournaments",
          "Scholarship programs",
          "Guild NFT perks",
          "Training sessions"
        ],
        benefits: [
          "Earn while playing",
          "Exclusive game access",
          "Community support",
          "Skill development"
        ]
      },
      {
        id: 6,
        name: "Crypto News Premium",
        description: "Breaking crypto news and insider market insights",
        detailedDescription: "Stay ahead with premium crypto news, market analysis, and insider insights from industry experts and institutional traders.",
        price: "9.99",
        duration: "Monthly",
        paymentToken: "USDC",
        creator: "0x6789...0123",
        creatorName: "CryptoInsider News",
        subscribers: 5400,
        rating: 4.4,
        category: "News",
        featured: false,
        features: [
          "Breaking news alerts",
          "Market analysis reports",
          "Insider trading data",
          "Weekly newsletters"
        ],
        benefits: [
          "First to know updates",
          "Market edge insights",
          "Institutional data",
          "Expert commentary"
        ]
      },
    ]
    setPlans(mockPlans)
  }, [])

  const categories = ["all", "Trading", "Education", "Art", "DeFi", "Gaming", "News"]

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || plan.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubscribeClick = (plan: Plan) => {
    setPlanToSubscribe(plan)
    setShowConfirmation(true)
    setShowDetails(false) // Close the details modal
  }

  const handleConfirmSubscription = async () => {
    if (!planToSubscribe) return
    
    setSubscribing(planToSubscribe.id)
    setShowConfirmation(false)
    
    try {
      // Here you would interact with the smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Subscription successful!",
        description: "You've successfully subscribed to the plan. Your NFT membership pass will be minted shortly.",
      })
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription.",
        variant: "destructive",
      })
    } finally {
      setSubscribing(null)
      setPlanToSubscribe(null)
    }
  }

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowDetails(true)
  }

  const ConfirmationModal = ({ plan }: { plan: Plan }) => (
    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Confirm Subscription
          </DialogTitle>
          <DialogDescription>
            Please review your subscription details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Creator:</span>
              <span className="font-medium">{plan.creatorName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{plan.duration}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subscribers:</span>
              <span className="font-medium">{plan.subscribers.toLocaleString()}</span>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
            <div className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="w-3 h-3 mr-2 text-green-600 flex-shrink-0" />
                  {feature}
                </div>
              ))}
              {plan.features.length > 3 && (
                <div className="text-sm text-gray-500 ml-5">
                  +{plan.features.length - 3} more features
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-500">
                  {plan.paymentToken} • {plan.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              disabled={subscribing === plan.id}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {subscribing === plan.id ? "Processing..." : "Confirm & Subscribe"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to the creator's terms and conditions. 
            Your NFT membership pass will be minted upon successful payment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )

  const PlanDetailsModal = ({ plan }: { plan: Plan }) => (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            {plan.name}
            {plan.featured && (
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {plan.detailedDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div className="font-semibold">{plan.subscribers.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Subscribers</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="font-semibold">{plan.rating}/5</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            {plan.successRate && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="font-semibold">{plan.successRate}</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="font-semibold">{plan.duration}</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Creator Information</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{plan.creatorName}</p>
                <p className="text-sm text-gray-600">{plan.creator}</p>
              </div>
              {plan.totalEarnings && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="font-semibold text-green-600">{plan.totalEarnings}</p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing and Subscribe */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  ${plan.price} {plan.paymentToken}
                </div>
                <div className="text-purple-100">per {plan.duration.toLowerCase()}</div>
                {plan.nextPayment && (
                  <div className="text-sm text-purple-200 mt-1">
                    Next payment: {plan.nextPayment}
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleSubscribeClick(plan)}
                disabled={subscribing === plan.id}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                {subscribing === plan.id ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Explore Subscription Plans</h1>
        <p className="text-lg text-blue-700 max-w-2xl mx-auto">
          Discover premium content and services from Web3 creators. Subscribe with crypto and get exclusive NFT
          membership passes.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Plans */}
      {selectedCategory === "all" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center">
            <Star className="mr-2 h-5 w-5 text-white-500" />
            Featured Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans
              .filter((plan) => plan.featured)
              .map((plan) => (
                <Card key={plan.id} className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105" onClick={() => handlePlanClick(plan)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {plan.name}
                          <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {plan.subscribers.toLocaleString()} subscribers
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {plan.rating}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {plan.duration}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${plan.price} {plan.paymentToken}
                        </div>
                        <div className="text-sm text-gray-500">per {plan.duration.toLowerCase()}</div>
                      </div>
                      <div className="text-sm text-purple-600 font-medium">
                        Click to view details →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Plans */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-700">
          {selectedCategory === "all" ? "All Plans" : `${selectedCategory} Plans`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-all cursor-pointer hover:scale-105" onClick={() => handlePlanClick(plan)}>
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {plan.subscribers.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {plan.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      ${plan.price} {plan.paymentToken}
                    </div>
                    <div className="text-sm text-gray-500">per {plan.duration.toLowerCase()}</div>
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    View details →
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No plans found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Plan Details Modal */}
      {selectedPlan && <PlanDetailsModal plan={selectedPlan} />}

      {/* Confirmation Modal */}
      {planToSubscribe && <ConfirmationModal plan={planToSubscribe} />}
    </div>
  )
}