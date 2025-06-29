"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, DollarSign, Clock, Coins, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CreatePlanModalProps {
  userAddress: string
}

export function CreatePlanModal({ userAddress }: CreatePlanModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
    paymentToken: "USDC",
    metadataURI: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const paymentTokens = [
    { value: "USDC", label: "USDC", address: "0xA0b86a33E6441b8C4505E2c8C5E6e8b8C4505E2c8" },
    { value: "DAI", label: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    { value: "USDT", label: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  ]

  const durationOptions = [
    { value: "7", label: "1 Week" },
    { value: "30", label: "1 Month" },
    { value: "90", label: "3 Months" },
    { value: "365", label: "1 Year" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmCreate = async () => {
    setShowConfirmation(false)
    setIsCreating(true)

    try {
      // Here you would interact with the smart contract
      // For now, we'll simulate the creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsCreating(false)
      setShowSuccess(true)

      // Show success toast
      toast({
        title: "Plan created successfully!",
        description: `Your subscription plan "${formData.name}" has been created.`,
      })

    } catch (error) {
      setIsCreating(false)
      toast({
        title: "Failed to create plan",
        description: "There was an error creating your subscription plan.",
        variant: "destructive",
      })
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "30",
      paymentToken: "USDC",
      metadataURI: "",
    })
  }

  const getSelectedDurationLabel = () => {
    return durationOptions.find((d) => d.value === formData.duration)?.label || "1 Month"
  }

  const calculatePlatformFee = () => {
    return ((Number.parseFloat(formData.price) || 0) * 0.025).toFixed(2)
  }

  const calculateYouReceive = () => {
    return ((Number.parseFloat(formData.price) || 0) * 0.975).toFixed(2)
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create Subscription Plan
            </CardTitle>
            <CardDescription>Set up a new subscription plan for your content or service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    placeholder="Premium Content Access"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="5.00"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what subscribers will get access to..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Token</Label>
                  <Select
                    value={formData.paymentToken}
                    onValueChange={(value) => setFormData({ ...formData, paymentToken: value })}
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTokens.map((token) => (
                        <SelectItem key={token.value} value={token.value}>
                          {token.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Billing Period</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadataURI">NFT Metadata URI (Optional)</Label>
                <Input
                  id="metadataURI"
                  placeholder="https://your-metadata-url.com/metadata.json"
                  value={formData.metadataURI}
                  onChange={(e) => setFormData({ ...formData, metadataURI: e.target.value })}
                />
                <p className="text-sm text-gray-500">URL to the JSON metadata for the NFT membership pass</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Plan Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Price:</strong> ${formData.price || "0.00"} {formData.paymentToken}
                  </p>
                  <p>
                    <strong>Billing:</strong> Every {getSelectedDurationLabel().toLowerCase()}
                  </p>
                  <p>
                    <strong>Platform Fee:</strong> 2.5% (${calculatePlatformFee()} {formData.paymentToken})
                  </p>
                  <p>
                    <strong>You Receive:</strong> ${calculateYouReceive()} {formData.paymentToken}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isCreating}
              >
                {isCreating ? "Creating Plan..." : "Create Subscription Plan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Plan Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your subscription plan details before creating it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div><strong>Plan Name:</strong> {formData.name}</div>
              <div><strong>Description:</strong> {formData.description}</div>
              <div><strong>Price:</strong> ${formData.price} {formData.paymentToken}</div>
              <div><strong>Billing Period:</strong> {getSelectedDurationLabel()}</div>
              <div><strong>Platform Fee:</strong> ${calculatePlatformFee()} {formData.paymentToken}</div>
              <div><strong>You'll Receive:</strong> ${calculateYouReceive()} {formData.paymentToken}</div>
              {formData.metadataURI && (
                <div><strong>NFT Metadata:</strong> {formData.metadataURI}</div>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCreate}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Confirm & Create Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Plan Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription plan "{formData.name}" has been created and is now live.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Share your subscription plan with your audience</li>
                <li>• Monitor subscriptions in your dashboard</li>
                <li>• Start delivering value to your subscribers</li>
              </ul>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleSuccessClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}