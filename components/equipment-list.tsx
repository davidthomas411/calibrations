"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EquipmentDetails } from "./equipment-details"
import { ChevronRight, Calendar, User, MapPin } from "lucide-react"

interface Equipment {
  id: number
  name: string
  description: string
  serial_number: string
  manufacturer: string
  model: string
  equipment_type_name: string
  calibration_status_name: string
  status_color: string
  last_calibration_date: string
  next_calibration_date: string
  assigned_person: string
  location: string
  is_overdue: boolean
  is_in_progress: boolean
  is_completed: boolean
}

interface EquipmentListProps {
  equipment: Equipment[]
}

export function EquipmentList({ equipment }: EquipmentListProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const getStatusColor = (item: Equipment) => {
    if (item.is_overdue) return "bg-red-100 text-red-800 border-red-200"
    if (item.is_in_progress) return "bg-blue-100 text-blue-800 border-blue-200"
    if (item.is_completed) return "bg-green-100 text-green-800 border-green-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl text-jefferson-deep-blue">
            Equipment Timeline View ({equipment.length} items)
          </CardTitle>
          <p className="text-xs md:text-sm text-gray-600">
            <span className="hidden sm:inline">Scroll to see calibrations • Use ↑↓ keys or scroll buttons</span>
            <span className="sm:hidden">Scroll to see calibrations</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
              ← Past
            </Button>
            <Button variant="outline" size="sm" className="bg-jefferson-bright-blue text-white text-xs md:text-sm">
              Today
            </Button>
            <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
              Future →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto smooth-scroll">
            {equipment.map((item) => {
              const daysUntilDue = getDaysUntilDue(item.next_calibration_date)

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer space-y-2 md:space-y-0"
                  onClick={() => setSelectedEquipment(item)}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 md:space-x-3">
                      <h3 className="font-medium text-sm md:text-base text-jefferson-deep-blue">{item.name}</h3>
                      <Badge className={`${getStatusColor(item)} text-xs`}>{item.calibration_status_name}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.equipment_type_name}
                      </Badge>
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">{item.assigned_person}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last: {new Date(item.last_calibration_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:block md:text-right">
                    <div>
                      <div className="text-xs md:text-sm font-medium">
                        Next: {new Date(item.next_calibration_date).toLocaleDateString()}
                      </div>
                      <div
                        className={`text-xs ${
                          daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 30 ? "text-orange-600" : "text-gray-600"
                        }`}
                      >
                        {daysUntilDue < 0
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0
                            ? "Due today"
                            : `${daysUntilDue} days remaining`}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 md:mt-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedEquipment && (
        <EquipmentDetails equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}
    </>
  )
}
