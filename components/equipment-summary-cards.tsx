"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle } from "lucide-react"

interface Equipment {
  id: number
  name: string
  equipment_type_name: string
  calibration_status_name: string
  next_calibration_date: string
  is_overdue: boolean
}

interface EquipmentType {
  id: number
  name: string
}

interface EquipmentSummaryCardsProps {
  equipment: Equipment[]
  equipmentTypes: EquipmentType[]
  onFilterChange?: (filters: string[]) => void
  activeFilters?: string[]
}

export function EquipmentSummaryCards({
  equipment,
  equipmentTypes,
  onFilterChange = () => {},
  activeFilters = [],
}: EquipmentSummaryCardsProps) {
  const totalEquipment = equipment.length
  const overdueCount = equipment.filter((e) => e.is_overdue).length
  const dueSoonCount = equipment.filter((e) => {
    const dueDate = new Date(e.next_calibration_date)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return dueDate <= thirtyDaysFromNow && !e.is_overdue
  }).length

  const getEquipmentCountByType = (typeName: string) => {
    return equipment.filter((e) => e.equipment_type_name === typeName).length
  }

  const handleCardClick = (filter: string) => {
    if (activeFilters.includes(filter)) {
      onFilterChange(activeFilters.filter((f) => f !== filter))
    } else {
      onFilterChange([...activeFilters, filter])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* Total Equipment */}
      <Card
        className={`bg-white hover:shadow-lg transition-all cursor-pointer ${
          activeFilters.includes("total") ? "ring-2 ring-jefferson-bright-blue" : ""
        }`}
        onClick={() => handleCardClick("total")}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Equipment</p>
              <p className="text-2xl md:text-3xl font-bold text-jefferson-deep-blue">{totalEquipment}</p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          </div>
          {activeFilters.includes("total") && (
            <Badge className="mt-2 bg-jefferson-bright-blue text-white text-xs">Filter Active</Badge>
          )}
        </CardContent>
      </Card>

      {/* Equipment Types */}
      {equipmentTypes.map((type) => (
        <Card
          key={type.id}
          className={`bg-white hover:shadow-lg transition-all cursor-pointer ${
            activeFilters.includes(type.name) ? "ring-2 ring-jefferson-bright-blue" : ""
          }`}
          onClick={() => handleCardClick(type.name)}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{type.name}s</p>
                <p className="text-2xl md:text-3xl font-bold text-jefferson-deep-blue">
                  {getEquipmentCountByType(type.name)}
                </p>
              </div>
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            {activeFilters.includes(type.name) && (
              <Badge className="mt-2 bg-jefferson-bright-blue text-white text-xs">Filter Active</Badge>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Due Soon */}
      <Card
        className={`bg-white hover:shadow-lg transition-all cursor-pointer ${
          activeFilters.includes("due-soon") ? "ring-2 ring-jefferson-bright-blue" : ""
        }`}
        onClick={() => handleCardClick("due-soon")}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-500">{dueSoonCount}</p>
            </div>
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
          </div>
          {dueSoonCount > 0 && (
            <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-800 text-xs">
              Next 30 days
            </Badge>
          )}
          {activeFilters.includes("due-soon") && (
            <Badge className="mt-2 bg-jefferson-bright-blue text-white text-xs">Filter Active</Badge>
          )}
        </CardContent>
      </Card>

      {/* Overdue */}
      {overdueCount > 0 && (
        <Card
          className={`bg-white hover:shadow-lg transition-all cursor-pointer border-academic-red ${
            activeFilters.includes("overdue") ? "ring-2 ring-academic-red" : ""
          }`}
          onClick={() => handleCardClick("overdue")}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl md:text-3xl font-bold text-academic-red">{overdueCount}</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-academic-red" />
            </div>
            <Badge variant="destructive" className="mt-2 text-xs">
              Immediate attention
            </Badge>
            {activeFilters.includes("overdue") && (
              <Badge className="mt-2 bg-academic-red text-white text-xs">Filter Active</Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
