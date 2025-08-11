"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EquipmentSummaryCards } from "@/components/equipment-summary-cards"
import { EquipmentSearch } from "@/components/equipment-search"
import { EquipmentList } from "@/components/equipment-list"
import { TimelineView } from "@/components/timeline-view"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { EmailNotificationPanel } from "@/components/email-notification-panel"
import { ChangeLogViewer } from "@/components/change-log-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const [equipment, setEquipment] = useState<any[]>([]) // Added proper typing
  const [equipmentTypes, setEquipmentTypes] = useState<any[]>([]) // Added proper typing
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchFilters, setSearchFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Added error state

  const fetchEquipment = async () => {
    setIsLoading(true)
    setError(null) // Reset error state
    try {
      // Implemented dynamic filtering with API calls
      const params = new URLSearchParams()

      if (activeFilters.length > 0) {
        activeFilters.forEach((filter) => {
          if (filter === "overdue") params.append("status", "overdue")
          else if (filter === "due-soon") params.append("status", "due-soon")
          else if (filter === "in-progress") params.append("status", "in-progress")
          else if (filter !== "total") params.append("equipmentType", filter)
        })
      }

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const response = await fetch(`/api/equipment?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setEquipment(Array.isArray(data.equipment) ? data.equipment : [])
        setEquipmentTypes(Array.isArray(data.equipmentTypes) ? data.equipmentTypes : [])
      } else {
        setError(`Failed to fetch equipment data: ${response.statusText}`)
        setEquipment([])
        setEquipmentTypes([])
      }
    } catch (error) {
      console.error("Error fetching equipment:", error)
      setError("Failed to connect to the server. Please try again.")
      setEquipment([])
      setEquipmentTypes([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [activeFilters, searchFilters])

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters)
  }

  const handleSearchFilterChange = (filters: any) => {
    setSearchFilters(filters)
  }

  const handleSearch = (searchTerm: string) => {
    setSearchFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jefferson-deep-blue flex items-center justify-center">
        <div className="text-white text-xl">Loading equipment data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-jefferson-deep-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={fetchEquipment}
            className="bg-jefferson-bright-blue text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jefferson-deep-blue">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="logs">Change Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards with Active Filtering */}
            <EquipmentSummaryCards
              equipment={equipment}
              equipmentTypes={equipmentTypes}
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />

            {/* Enhanced Dashboard */}
            <EnhancedDashboard
              equipment={equipment}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />

            {/* Advanced Search with Filtering */}
            <EquipmentSearch
              onSearch={handleSearch}
              onFilterChange={handleSearchFilterChange}
              equipmentTypes={equipmentTypes}
              locations={[...new Set(equipment.map((e: any) => e.location).filter(Boolean))]}
              assignedPersons={[...new Set(equipment.map((e: any) => e.assigned_person).filter(Boolean))]}
            />

            {/* Equipment List */}
            <EquipmentList equipment={equipment} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineView equipment={equipment} />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <EmailNotificationPanel />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <ChangeLogViewer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
