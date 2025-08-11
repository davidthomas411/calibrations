"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"

interface EquipmentSearchProps {
  onSearch?: (searchTerm: string) => void
  onFilterChange?: (filters: any) => void
  equipmentTypes?: any[]
  locations?: string[]
  assignedPersons?: string[]
}

export function EquipmentSearch({
  onSearch = () => {},
  onFilterChange = () => {},
  equipmentTypes = [],
  locations = [],
  assignedPersons = [],
}: EquipmentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    equipmentType: "all",
    location: "all",
    assignedPerson: "all",
    status: "all",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = () => {
    onSearch(searchTerm)
    onFilterChange(filters)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      equipmentType: "all",
      location: "all",
      assignedPerson: "all",
      status: "all",
    })
    onSearch("")
    onFilterChange({})
  }

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-4 space-y-4">
        {/* Main Search */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search equipment by type, serial number, description, or assigned person..."
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            variant="outline"
            className="border-jefferson-bright-blue text-jefferson-deep-blue"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={handleSearch}
            className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
          >
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Equipment Type</label>
              <Select value={filters.equipmentType} onValueChange={(value) => updateFilter("equipmentType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due-soon">Due Soon</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="calibrated">Calibrated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assigned Person</label>
              <Select value={filters.assignedPerson} onValueChange={(value) => updateFilter("assignedPerson", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All persons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All persons</SelectItem>
                  {assignedPersons.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
