"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, CheckCircle, Clock, Filter, X } from "lucide-react"

interface Equipment {
  id: number
  name: string
  equipment_type_name: string
  calibration_status_name: string
  next_calibration_date: string
  assigned_person: string
  is_overdue: boolean
  is_in_progress: boolean
  is_completed: boolean
}

interface EnhancedDashboardProps {
  equipment: Equipment[]
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
}

export function EnhancedDashboard({ equipment, activeFilters, onFilterChange }: EnhancedDashboardProps) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    upcoming: true,
    overdue: true,
    inProgress: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Calculate metrics
  const totalEquipment = equipment.length
  const overdueEquipment = equipment.filter((e) => e.is_overdue)
  const inProgressEquipment = equipment.filter((e) => e.is_in_progress)
  const upcomingEquipment = equipment.filter((e) => {
    const dueDate = new Date(e.next_calibration_date)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return dueDate <= thirtyDaysFromNow && !e.is_overdue && !e.is_in_progress
  })

  const completedThisMonth = equipment.filter((e) => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextCalibration = new Date(e.next_calibration_date)
    return e.is_completed && nextCalibration >= startOfMonth
  })

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      onFilterChange([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    onFilterChange(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card className="bg-jefferson-bright-blue/10 border-jefferson-bright-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-jefferson-deep-blue" />
                <span className="text-sm font-medium text-jefferson-deep-blue">Active Filters:</span>
                <div className="flex space-x-2">
                  {activeFilters.map((filter) => (
                    <Badge key={filter} variant="secondary" className="bg-jefferson-deep-blue text-white">
                      {filter}
                      <button
                        onClick={() => removeFilter(filter)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      <Collapsible open={expandedSections.overview} onOpenChange={() => toggleSection("overview")}>
        <Card className="bg-white">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-jefferson-deep-blue flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Overview Metrics
                </CardTitle>
                {expandedSections.overview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all duration-300 ease-in-out">
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-jefferson-deep-blue">{totalEquipment}</div>
                  <div className="text-sm text-gray-600">Total Equipment</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedThisMonth.length}</div>
                  <div className="text-sm text-gray-600">Completed This Month</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{upcomingEquipment.length}</div>
                  <div className="text-sm text-gray-600">Due Soon</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{overdueEquipment.length}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Overdue Equipment */}
      {overdueEquipment.length > 0 && (
        <Collapsible open={expandedSections.overdue} onOpenChange={() => toggleSection("overdue")}>
          <Card className="bg-white border-red-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-red-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-600 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Overdue Equipment ({overdueEquipment.length})
                  </CardTitle>
                  {expandedSections.overdue ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent className="transition-all duration-300 ease-in-out">
              <CardContent>
                <div className="space-y-3">
                  {overdueEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => addFilter(item.equipment_type_name)}
                    >
                      <div>
                        <h4 className="font-medium text-red-800">{item.name}</h4>
                        <p className="text-sm text-red-600">
                          {item.equipment_type_name} • {item.assigned_person}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-800">
                          Due: {new Date(item.next_calibration_date).toLocaleDateString()}
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {Math.abs(
                            Math.ceil(
                              (new Date().getTime() - new Date(item.next_calibration_date).getTime()) /
                                (1000 * 60 * 60 * 24),
                            ),
                          )}{" "}
                          days overdue
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* In Progress Equipment */}
      {inProgressEquipment.length > 0 && (
        <Collapsible open={expandedSections.inProgress} onOpenChange={() => toggleSection("inProgress")}>
          <Card className="bg-white border-blue-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-600 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    In Progress Calibrations ({inProgressEquipment.length})
                  </CardTitle>
                  {expandedSections.inProgress ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent className="transition-all duration-300 ease-in-out">
              <CardContent>
                <div className="space-y-3">
                  {inProgressEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => addFilter(item.equipment_type_name)}
                    >
                      <div>
                        <h4 className="font-medium text-blue-800">{item.name}</h4>
                        <p className="text-sm text-blue-600">
                          {item.equipment_type_name} • {item.assigned_person}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Upcoming Calibrations */}
      <Collapsible open={expandedSections.upcoming} onOpenChange={() => toggleSection("upcoming")}>
        <Card className="bg-white border-orange-200">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Upcoming Calibrations ({upcomingEquipment.length})
                </CardTitle>
                {expandedSections.upcoming ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all duration-300 ease-in-out">
            <CardContent>
              <div className="space-y-3">
                {upcomingEquipment.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => addFilter(item.equipment_type_name)}
                  >
                    <div>
                      <h4 className="font-medium text-orange-800">{item.name}</h4>
                      <p className="text-sm text-orange-600">
                        {item.equipment_type_name} • {item.assigned_person}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-800">
                        Due: {new Date(item.next_calibration_date).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                        {Math.ceil(
                          (new Date(item.next_calibration_date).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days remaining
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
