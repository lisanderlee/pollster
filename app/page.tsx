'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import Image from "next/image"

type Campaign = {
  id: number
  name: string
  description: string
  image: string
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState({ name: "", description: "", image: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Handle the error appropriately, e.g., set an error state
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCampaign(prev => ({ ...prev, [name]: value }))
  }

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      })
      if (!response.ok) {
        throw new Error('Failed to add campaign')
      }
      await fetchCampaigns()
      setNewCampaign({ name: "", description: "", image: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding campaign:', error)
    }
  }

  const handleDeleteCampaign = async (id: number) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete campaign')
      }
      await fetchCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Campaigns</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input type="search" placeholder="Search campaigns..." className="flex-grow max-w-md" />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCampaign.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newCampaign.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={newCampaign.image}
                  onChange={handleInputChange}
                  placeholder="/placeholder.svg?height=100&width=100"
                  required
                />
              </div>
              <Button type="submit">Add Campaign</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="flex flex-col relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => handleDeleteCampaign(campaign.id)}
              aria-label={`Delete ${campaign.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="flex-grow">
              <div className="flex items-center space-x-4">
                <Image
                  src={campaign.image}
                  alt={`${campaign.name} image`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <CardTitle>{campaign.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{campaign.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}