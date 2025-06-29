"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Settings,
  ExternalLink,
  Download,
  X,
  Check,
  AlertCircle,
  BarChart3,
  FileDown,
  Edit3,
  Pause,
  Play,
  Mail,
} from "lucide-react"
import Image from "next/image"

interface UserDashboardProps {
  userAddress: string
}

interface Subscription {
  id: number
  planName: string
  price: string
  token: string
  nextBilling: string
  status: "active" | "expired" | "cancelled" | "paused"
  nftTokenId: string
  creator: string
  nftImage: string // Remove the optional ? mark
}

interface CreatedPlan {
  id: number
  name: string
  description?: string
  price: string
  token: string
  subscribers: number
  revenue: string
  status: "active" | "paused"
  category?: string
  billingCycle?: "monthly" | "yearly" | "lifetime"
}

interface Subscriber {
  id: number
  address: string
  joinDate: string
  status: "active" | "paused" | "cancelled"
  totalPaid: string
  nftTokenId: string
}

export function UserDashboard({ userAddress = "0x1234...5678" }: UserDashboardProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [createdPlans, setCreatedPlans] = useState<CreatedPlan[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  // Dialog states
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [nftDialogOpen, setNftDialogOpen] = useState(false)
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<CreatedPlan | null>(null)

  // New dialog states for plan management
  const [editDetailsDialogOpen, setEditDetailsDialogOpen] = useState(false)
  const [updatePricingDialogOpen, setUpdatePricingDialogOpen] = useState(false)
  const [manageSubscribersDialogOpen, setManageSubscribersDialogOpen] = useState(false)
  const [pausePlanDialogOpen, setPausePlanDialogOpen] = useState(false)

  // Add after existing dialog states
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const [changePaymentDialogOpen, setChangePaymentDialogOpen] = useState(false)
  const [pauseSubscriptionDialogOpen, setPauseSubscriptionDialogOpen] = useState(false)
  const [cancelSubscriptionDialogOpen, setCancelSubscriptionDialogOpen] = useState(false)

  // Form states
  const [editPlanForm, setEditPlanForm] = useState({
    name: "",
    description: "",
    category: "",
    billingCycle: "monthly",
  })

  const [pricingForm, setPricingForm] = useState({
    price: "",
    token: "USDC",
  })

  // Add new form state for payment method
  const [paymentForm, setPaymentForm] = useState({
    walletAddress: "",
    paymentToken: "USDC",
  })

  const [stats, setStats] = useState({
    totalSpent: "0",
    activeSubscriptions: 0,
    nftsOwned: 0,
    totalEarned: "0",
    totalSubscribers: 0,
    activePlans: 0,
  })

  useEffect(() => {
    // Mock data - in real app, this would come from the blockchain
    const mockSubscriptions: Subscription[] = [
      {
        id: 1,
        planName: "Crypto Trading Signals",
        price: "29.99",
        token: "USDC",
        nextBilling: "2024-02-15",
        status: "active",
        nftTokenId: "1001",
        creator: "0x1234...5678",
        nftImage: "/images/nft-pass-1.png",
      },
      {
        id: 2,
        planName: "Web3 Development Course",
        price: "99.99",
        token: "DAI",
        nextBilling: "Lifetime",
        status: "active",
        nftTokenId: "1002",
        creator: "0x2345...6789",
        nftImage: "/images/nft-pass-2.png",
      },
      {
        id: 3,
        planName: "NFT Art Collection Access",
        price: "15.00",
        token: "USDC",
        nextBilling: "2024-01-20",
        status: "expired",
        nftTokenId: "1003",
        creator: "0x3456...7890",
        nftImage: "/images/nft-pass-3.png",
      },
    ]

    const mockCreatedPlans: CreatedPlan[] = [
      {
        id: 1,
        name: "Premium Content Access",
        description: "Access to exclusive premium content and community features",
        price: "19.99",
        token: "USDC",
        subscribers: 45,
        revenue: "899.55",
        status: "active",
        category: "Entertainment",
        billingCycle: "monthly",
      },
      {
        id: 2,
        name: "Exclusive Community",
        description: "Join our exclusive community with special perks",
        price: "9.99",
        token: "USDC",
        subscribers: 128,
        revenue: "1278.72",
        status: "active",
        category: "Community",
        billingCycle: "monthly",
      },
    ]

    const mockSubscribers: Subscriber[] = [
      {
        id: 1,
        address: "0x1111...2222",
        joinDate: "2024-01-15",
        status: "active",
        totalPaid: "59.97",
        nftTokenId: "2001",
      },
      {
        id: 2,
        address: "0x3333...4444",
        joinDate: "2024-01-10",
        status: "active",
        totalPaid: "39.98",
        nftTokenId: "2002",
      },
      {
        id: 3,
        address: "0x5555...6666",
        joinDate: "2024-01-05",
        status: "paused",
        totalPaid: "19.99",
        nftTokenId: "2003",
      },
    ]

    setSubscriptions(mockSubscriptions)
    setCreatedPlans(mockCreatedPlans)
    setSubscribers(mockSubscribers)

    // Calculate stats
    const activeSubscriptions = mockSubscriptions.filter((s) => s.status === "active").length
    const totalSpent = mockSubscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + Number.parseFloat(s.price), 0)
      .toFixed(2)

    const totalEarned = mockCreatedPlans.reduce((sum, p) => sum + Number.parseFloat(p.revenue), 0).toFixed(2)
    const totalSubscribers = mockCreatedPlans.reduce((sum, p) => sum + p.subscribers, 0)

    setStats({
      totalSpent,
      activeSubscriptions,
      nftsOwned: mockSubscriptions.filter((s) => s.status === "active").length,
      totalEarned,
      totalSubscribers,
      activePlans: mockCreatedPlans.filter((p) => p.status === "active").length,
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRenew = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setRenewDialogOpen(true)
  }

  const confirmRenew = () => {
    if (selectedSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id ? { ...sub, status: "active" as const, nextBilling: "2024-03-15" } : sub,
        ),
      )
      setRenewDialogOpen(false)
      setSelectedSubscription(null)
    }
  }

  const handleManage = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setManageDialogOpen(true)
  }

  const handleViewNFT = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setNftDialogOpen(true)
  }

  const handleEditPlan = (plan: CreatedPlan) => {
    setSelectedPlan(plan)
    setEditPlanDialogOpen(true)
  }

  // New plan management handlers
  const handleEditDetails = () => {
    if (selectedPlan) {
      setEditPlanForm({
        name: selectedPlan.name,
        description: selectedPlan.description || "",
        category: selectedPlan.category || "",
        billingCycle: selectedPlan.billingCycle || "monthly",
      })
      setEditDetailsDialogOpen(true)
      setEditPlanDialogOpen(false)
    }
  }

  const handleUpdatePricing = () => {
    if (selectedPlan) {
      setPricingForm({
        price: selectedPlan.price,
        token: selectedPlan.token,
      })
      setUpdatePricingDialogOpen(true)
      setEditPlanDialogOpen(false)
    }
  }

  const handleManageSubscribers = () => {
    setManageSubscribersDialogOpen(true)
    setEditPlanDialogOpen(false)
  }

  const handlePausePlan = () => {
    setPausePlanDialogOpen(true)
    setEditPlanDialogOpen(false)
  }

  const saveEditDetails = () => {
    if (selectedPlan) {
      setCreatedPlans((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...plan,
                name: editPlanForm.name,
                description: editPlanForm.description,
                category: editPlanForm.category,
                billingCycle: editPlanForm.billingCycle as "monthly" | "yearly" | "lifetime",
              }
            : plan,
        ),
      )
      setEditDetailsDialogOpen(false)
      setSelectedPlan(null)
    }
  }

  const savePricing = () => {
    if (selectedPlan) {
      setCreatedPlans((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...plan,
                price: pricingForm.price,
                token: pricingForm.token,
              }
            : plan,
        ),
      )
      setUpdatePricingDialogOpen(false)
      setSelectedPlan(null)
    }
  }

  const confirmPausePlan = () => {
    if (selectedPlan) {
      const newStatus = selectedPlan.status === "active" ? "paused" : "active"
      setCreatedPlans((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id ? { ...plan, status: newStatus as "active" | "paused" } : plan,
        ),
      )
      setPausePlanDialogOpen(false)
      setSelectedPlan(null)
    }
  }

  const handleSubscriberAction = (subscriberId: number, action: "pause" | "cancel" | "contact") => {
    switch (action) {
      case "pause":
        setSubscribers((prev) =>
          prev.map((sub) =>
            sub.id === subscriberId ? { ...sub, status: sub.status === "active" ? "paused" : "active" } : sub,
          ),
        )
        break
      case "cancel":
        setSubscribers((prev) => prev.map((sub) => (sub.id === subscriberId ? { ...sub, status: "cancelled" } : sub)))
        break
      case "contact":
        alert(`Opening contact form for subscriber ${subscriberId}...`)
        break
    }
  }

  const handleAnalytics = (plan: CreatedPlan) => {
    // Mock analytics data - in real app, this would come from API
    const mockAnalytics = {
      planId: plan.id,
      planName: plan.name,
      overview: {
        totalRevenue: plan.revenue,
        totalSubscribers: plan.subscribers,
        activeSubscribers: Math.floor(plan.subscribers * 0.85),
        churnRate: "12%",
        avgRevenuePerUser: (Number.parseFloat(plan.revenue) / plan.subscribers).toFixed(2),
        conversionRate: "24%",
      },
      growth: {
        subscriberGrowth: "+15%",
        revenueGrowth: "+22%",
        monthlyGrowth: [
          { month: "Jan", subscribers: 25, revenue: 499.75 },
          { month: "Feb", subscribers: 32, revenue: 638.68 },
          { month: "Mar", subscribers: 38, revenue: 759.62 },
          { month: "Apr", subscribers: 45, revenue: 899.55 },
        ],
      },
      demographics: {
        topCountries: [
          { country: "United States", percentage: 45 },
          { country: "United Kingdom", percentage: 22 },
          { country: "Canada", percentage: 15 },
          { country: "Germany", percentage: 10 },
          { country: "Others", percentage: 8 },
        ],
        ageGroups: [
          { group: "18-24", percentage: 25 },
          { group: "25-34", percentage: 40 },
          { group: "35-44", percentage: 20 },
          { group: "45+", percentage: 15 },
        ],
      },
      engagement: {
        avgSessionTime: "12m 34s",
        contentViews: "2,847",
        downloadCount: "1,234",
        communityPosts: "156",
      },
    }

    setAnalyticsData(mockAnalytics)
    setSelectedPlan(plan) // <-- keep a reference for later
    setAnalyticsDialogOpen(true)
  }

  const handleExportData = (plan?: CreatedPlan | null) => {
    if (!plan) return // nothing to export
    const data = {
      planName: plan.name,
      subscribers: plan.subscribers,
      revenue: plan.revenue,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan.name.replace(/\s+/g, "_")}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleChangePayment = () => {
    if (selectedSubscription) {
      setPaymentForm({
        walletAddress: "",
        paymentToken: selectedSubscription.token,
      })
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === selectedSubscription.id ? { ...sub, token: paymentForm.paymentToken } : sub)),
      )
      setChangePaymentDialogOpen(false)
      setSelectedSubscription(null)
    }
  }

  const handlePauseSubscription = () => {
    if (selectedSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id ? { ...sub, status: "paused" as const, nextBilling: "Paused" } : sub,
        ),
      )
      setPauseSubscriptionDialogOpen(false)
      setSelectedSubscription(null)
    }
  }

  const handleCancelSubscription = () => {
    if (selectedSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id ? { ...sub, status: "cancelled" as const, nextBilling: "Cancelled" } : sub,
        ),
      )
      setCancelSubscriptionDialogOpen(false)
      setSelectedSubscription(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your subscriptions and created plans</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="nfts">NFT Passes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSpent}</div>
                <p className="text-xs text-muted-foreground">Across {stats.activeSubscriptions} active subscriptions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NFT Passes</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.nftsOwned}</div>
                <p className="text-xs text-muted-foreground">Active membership passes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalEarned}</div>
                <p className="text-xs text-muted-foreground">From {stats.totalSubscribers} subscribers</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest subscription and plan activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Subscription renewed</p>
                    <p className="text-xs text-gray-500">Crypto Trading Signals - $29.99 USDC</p>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New subscriber</p>
                    <p className="text-xs text-gray-500">Premium Content Access plan</p>
                  </div>
                  <div className="text-xs text-gray-500">5 hours ago</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">NFT pass minted</p>
                    <p className="text-xs text-gray-500">Token ID: 1004</p>
                  </div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid gap-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{subscription.planName}</CardTitle>
                      <CardDescription>Creator: {subscription.creator}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">
                        ${subscription.price} {subscription.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Billing</p>
                      <p className="font-medium">{subscription.nextBilling}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NFT Token ID</p>
                      <p className="font-medium">#{subscription.nftTokenId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {subscription.status === "active" && (
                      <Button variant="outline" size="sm" onClick={() => handleManage(subscription)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleViewNFT(subscription)}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View NFT
                    </Button>
                    {subscription.status === "expired" && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                        onClick={() => handleRenew(subscription)}
                      >
                        Renew
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6">
            {createdPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>
                        ${plan.price} {plan.token} per {plan.billingCycle}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Subscribers</p>
                      <p className="font-medium flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {plan.subscribers}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="font-medium">
                        ${plan.revenue} {plan.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Revenue</p>
                      <p className="font-medium">
                        ${(Number.parseFloat(plan.revenue) / 12).toFixed(2)} {plan.token}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Plan
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAnalytics(plan)}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportData(plan)}>
                      <FileDown className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your NFT Membership Passes</h2>
            <p className="text-gray-600">
              Exclusive digital passes that grant access to premium content and communities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions
              .filter((sub) => sub.status === "active")
              .map((subscription) => (
                <Card
                  key={subscription.nftTokenId}
                  className="border-2 border-purple-200 hover:border-purple-300 transition-colors overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Pass #{subscription.nftTokenId}</CardTitle>
                        <CardDescription className="font-medium">{subscription.planName}</CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square rounded-lg mb-4 relative overflow-hidden">
                      <Image
                        src={subscription.nftImage || "/placeholder.svg"}
                        alt={`NFT Pass #${subscription.nftTokenId}`}
                        fill
                        className="object-cover rounded-lg"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        #{subscription.nftTokenId}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Token ID</span>
                        <span className="text-sm font-mono">#{subscription.nftTokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Valid Until</span>
                        <span className="text-sm font-medium text-green-600">{subscription.nextBilling}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Creator</span>
                        <span className="text-sm font-mono">{subscription.creator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Value</span>
                        <span className="text-sm font-medium">
                          ${subscription.price} {subscription.token}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewNFT(subscription)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        OpenSea
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {subscriptions.filter((sub) => sub.status === "active").length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No NFT Passes Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Subscribe to premium plans to receive exclusive NFT membership passes that unlock special content and
                community access
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Explore Plans
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Existing Dialogs */}
      {/* Renew Confirmation Dialog */}
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Renew Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to renew your subscription to "{selectedSubscription?.planName}"?
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium">{selectedSubscription.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium">
                    ${selectedSubscription.price} {selectedSubscription.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creator:</span>
                  <span className="text-sm font-medium">{selectedSubscription.creator}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRenew} className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Check className="w-4 h-4 mr-2" />
              Confirm Renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Subscription Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>Configure settings for "{selectedSubscription?.planName}"</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Subscription Options</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setManageDialogOpen(false)
                    setChangePaymentDialogOpen(true)
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Change Payment Method
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setManageDialogOpen(false)
                    setPauseSubscriptionDialogOpen(true)
                  }}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Pause Subscription
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => {
                    setManageDialogOpen(false)
                    setCancelSubscriptionDialogOpen(true)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View NFT Dialog */}
      <Dialog open={nftDialogOpen} onOpenChange={setNftDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>NFT Pass Details</DialogTitle>
            <DialogDescription>Token #{selectedSubscription?.nftTokenId}</DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="py-4">
              <div className="aspect-square rounded-lg mb-4 relative overflow-hidden">
                <Image
                  src={selectedSubscription.nftImage || "/placeholder.svg"}
                  alt={`NFT Pass #${selectedSubscription.nftTokenId}`}
                  fill
                  className="object-cover rounded-lg"
                  crossOrigin="anonymous"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{selectedSubscription.nftTokenId}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Collection:</span>
                  <span className="text-sm font-medium">{selectedSubscription.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Token ID:</span>
                  <span className="text-sm font-mono">#{selectedSubscription.nftTokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creator:</span>
                  <span className="text-sm font-mono">{selectedSubscription.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on OpenSea
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setNftDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Main Dialog */}
      <Dialog open={editPlanDialogOpen} onOpenChange={setEditPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Modify settings for "{selectedPlan?.name}"</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Plan Management</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleEditDetails}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Plan Details
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleUpdatePricing}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Update Pricing
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleManageSubscribers}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Subscribers
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start ${selectedPlan?.status === "active" ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}`}
                  onClick={handlePausePlan}
                >
                  {selectedPlan?.status === "active" ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Plan
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlanDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Details Dialog */}
      <Dialog open={editDetailsDialogOpen} onOpenChange={setEditDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan Details</DialogTitle>
            <DialogDescription>Update the basic information for your plan</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={editPlanForm.name}
                onChange={(e) => setEditPlanForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter plan name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={editPlanForm.description}
                onChange={(e) => setEditPlanForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your plan..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-category">Category</Label>
              <Select
                value={editPlanForm.category}
                onValueChange={(value) => setEditPlanForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">Billing Cycle</Label>
              <Select
                value={editPlanForm.billingCycle}
                onValueChange={(value) => setEditPlanForm((prev) => ({ ...prev, billingCycle: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDetailsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditDetails}>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Pricing Dialog */}
      <Dialog open={updatePricingDialogOpen} onOpenChange={setUpdatePricingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Pricing</DialogTitle>
            <DialogDescription>Modify the price and payment token for your plan</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={pricingForm.price}
                onChange={(e) => setPricingForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Payment Token</Label>
              <Select
                value={pricingForm.token}
                onValueChange={(value) => setPricingForm((prev) => ({ ...prev, token: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Price Change Notice</p>
                  <p>
                    Existing subscribers will be notified of the price change and it will take effect on their next
                    billing cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdatePricingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePricing}>
              <Check className="w-4 h-4 mr-2" />
              Update Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Subscribers Dialog */}
      <Dialog open={manageSubscribersDialogOpen} onOpenChange={setManageSubscribersDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Subscribers</DialogTitle>
            <DialogDescription>View and manage your plan subscribers</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {subscribers.map((subscriber) => (
                <Card key={subscriber.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{subscriber.address}</p>
                          <p className="text-sm text-gray-500">
                            Joined {subscriber.joinDate} • Total paid: ${subscriber.totalPaid}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(subscriber.status)}>{subscriber.status}</Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriberAction(subscriber.id, "contact")}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriberAction(subscriber.id, "pause")}
                          >
                            {subscriber.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriberAction(subscriber.id, "cancel")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageSubscribersDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause/Resume Plan Dialog */}
      <Dialog open={pausePlanDialogOpen} onOpenChange={setPausePlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlan?.status === "active" ? (
                <>
                  <Pause className="w-5 h-5 text-orange-500" />
                  Pause Plan
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-green-500" />
                  Resume Plan
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan?.status === "active"
                ? "Are you sure you want to pause this plan? New subscriptions will be disabled."
                : "Are you sure you want to resume this plan? It will be available for new subscriptions."}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <Badge className={getStatusColor(selectedPlan.status)}>{selectedPlan.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subscribers:</span>
                  <span className="text-sm font-medium">{selectedPlan.subscribers}</span>
                </div>
              </div>
              {selectedPlan.status === "active" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important</p>
                      <p>
                        Existing subscribers will continue to have access, but no new subscriptions will be accepted
                        while paused.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPausePlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmPausePlan}
              className={
                selectedPlan?.status === "active"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedPlan?.status === "active" ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Plan
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analytics Dashboard
            </DialogTitle>
            <DialogDescription>Detailed insights for "{analyticsData?.planName}"</DialogDescription>
          </DialogHeader>

          {analyticsData && (
            <div className="py-4 space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-900">${analyticsData.overview.totalRevenue}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Active Subscribers</p>
                        <p className="text-2xl font-bold text-green-900">{analyticsData.overview.activeSubscribers}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Avg Revenue/User</p>
                        <p className="text-2xl font-bold text-purple-900">
                          ${analyticsData.overview.avgRevenuePerUser}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Churn Rate</p>
                        <p className="text-2xl font-bold text-orange-900">{analyticsData.overview.churnRate}</p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Conversion Rate</p>
                        <p className="text-2xl font-bold text-teal-900">{analyticsData.overview.conversionRate}</p>
                      </div>
                      <Check className="w-8 h-8 text-teal-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-pink-600 font-medium">Growth Rate</p>
                        <p className="text-2xl font-bold text-pink-900">{analyticsData.growth.subscriberGrowth}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-pink-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Trends</CardTitle>
                  <CardDescription>Monthly subscriber and revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.growth.monthlyGrowth.map((month: any, index: number) => (
                      <div key={month.month} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Subscribers: {month.subscribers}</span>
                            <span className="text-green-600">Revenue: ${month.revenue}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(month.subscribers / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Demographics and Engagement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Countries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Countries</CardTitle>
                    <CardDescription>Subscriber distribution by country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.demographics.topCountries.map((country: any, index: number) => (
                        <div key={country.country} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                    ? "bg-green-500"
                                    : index === 2
                                      ? "bg-purple-500"
                                      : index === 3
                                        ? "bg-orange-500"
                                        : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-sm font-medium">{country.country}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? "bg-blue-500"
                                    : index === 1
                                      ? "bg-green-500"
                                      : index === 2
                                        ? "bg-purple-500"
                                        : index === 3
                                          ? "bg-orange-500"
                                          : "bg-gray-400"
                                }`}
                                style={{ width: `${country.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{country.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Age Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Age Demographics</CardTitle>
                    <CardDescription>Subscriber age distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.demographics.ageGroups.map((group: any, index: number) => (
                        <div key={group.group} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-pink-500"
                                  : index === 1
                                    ? "bg-indigo-500"
                                    : index === 2
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium">{group.group}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? "bg-pink-500"
                                    : index === 1
                                      ? "bg-indigo-500"
                                      : index === 2
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${group.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{group.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                  <CardDescription>How subscribers interact with your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.engagement.avgSessionTime}</div>
                      <div className="text-sm text-blue-800">Avg Session Time</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.engagement.contentViews}</div>
                      <div className="text-sm text-green-800">Content Views</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.engagement.downloadCount}</div>
                      <div className="text-sm text-purple-800">Downloads</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {analyticsData.engagement.communityPosts}
                      </div>
                      <div className="text-sm text-orange-800">Community Posts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Common analytics actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportData(selectedPlan!)}>
                      <FileDown className="w-4 h-4 mr-2" />
                      Export Full Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Alerts
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Advanced Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>
              Close
            </Button>
            <Button disabled={!selectedPlan} onClick={() => handleExportData(selectedPlan)}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Payment Method Dialog */}
      <Dialog open={changePaymentDialogOpen} onOpenChange={setChangePaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Change Payment Method
            </DialogTitle>
            <DialogDescription>Update your payment method for "{selectedSubscription?.planName}"</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                value={paymentForm.walletAddress}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, walletAddress: e.target.value }))}
                placeholder="0x..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-token">Payment Token</Label>
              <Select
                value={paymentForm.paymentToken}
                onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, paymentToken: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Payment Method Update</p>
                  <p>
                    Changes will take effect on your next billing cycle. Make sure your new wallet has sufficient funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePayment} className="bg-blue-600 hover:bg-blue-700">
              <Check className="w-4 h-4 mr-2" />
              Update Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Subscription Dialog */}
      <Dialog open={pauseSubscriptionDialogOpen} onOpenChange={setPauseSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Pause Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to pause your subscription to "{selectedSubscription?.planName}"?
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium">{selectedSubscription.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <Badge className={getStatusColor(selectedSubscription.status)}>{selectedSubscription.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Billing:</span>
                  <span className="text-sm font-medium">{selectedSubscription.nextBilling}</span>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium">What happens when you pause?</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Your subscription will be paused immediately</li>
                      <li>• You'll retain access until your current billing period ends</li>
                      <li>• No future charges will occur</li>
                      <li>• You can resume anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseSubscriptionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePauseSubscription} className="bg-orange-600 hover:bg-orange-700">
              <Pause className="w-4 h-4 mr-2" />
              Pause Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelSubscriptionDialogOpen} onOpenChange={setCancelSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription to "{selectedSubscription?.planName}"?
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium">{selectedSubscription.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creator:</span>
                  <span className="text-sm font-medium">{selectedSubscription.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Cost:</span>
                  <span className="text-sm font-medium">
                    ${selectedSubscription.price} {selectedSubscription.token}
                  </span>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">This action cannot be undone</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Your subscription will be cancelled immediately</li>
                      <li>• You'll lose access to premium content</li>
                      <li>• Your NFT pass will be deactivated</li>
                      <li>• No refunds for the current billing period</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelSubscriptionDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">
              <X className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
