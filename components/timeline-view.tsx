"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar } from "lucide-react"

interface Equipment {
  id: number
  name: string
  equipment_type_name: string
  calibration_status_name: string
  next_calibration_date: string
  assigned_person: string
  is_overdue: boolean
  is_in_progress: boolean
}

interface TimelineViewProps {
  equipment: Equipment[]
}

export function TimelineView({ equipment }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Group equipment by month
  const groupEquipmentByMonth = () => {
    const grouped: { [key: string]: Equipment[] } = {}

    equipment.forEach((item) => {
      const date = new Date(item.next_calibration_date)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`

      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(item)
    })

    return grouped
  }

  const groupedEquipment = groupEquipmentByMonth()

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedYear, selectedMonth)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedMonth(newDate.getMonth())
    setSelectedYear(newDate.getFullYear())
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedMonth(today.getMonth())
    setSelectedYear(today.getFullYear())
  }

  const getMonthName = (month: number) => {
    return new Date(2024, month).toLocaleDateString("en-US", { month: "long" })
  }

  const getStatusColor = (item: Equipment) => {
    if (item.is_overdue) return "bg-red-500"
    if (item.is_in_progress) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStatusTextColor = (item: Equipment) => {
    if (item.is_overdue) return "text-red-600"
    if (item.is_in_progress) return "text-blue-600"
    return "text-green-600"
  }

  // Generate timeline for current view (6 months)
  const generateTimelineMonths = () => {
    const months = []
    const startDate = new Date(selectedYear, selectedMonth - 2)

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i)
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`
      const monthEquipment = groupedEquipment[monthKey] || []

      months.push({
        date: monthDate,
        key: monthKey,
        equipment: monthEquipment,
        isCurrentMonth:
          monthDate.getMonth() === new Date().getMonth() && monthDate.getFullYear() === new Date().getFullYear(),
      })
    }

    return months
  }

  const timelineMonths = generateTimelineMonths()

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <CardTitle className="text-lg md:text-xl text-jefferson-deep-blue flex items-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden sm:inline">Timeline View (6 Months)</span>
            <span className="sm:hidden">Timeline (6M)</span>
          </CardTitle>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="px-2 md:px-3">
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="bg-jefferson-bright-blue text-white px-2 md:px-3"
            >
              <span className="text-xs md:text-sm">Today</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="px-2 md:px-3">
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs md:text-sm text-gray-600">
          <span className="hidden md:inline">
            Scroll to see calibrations • Use ↑↓ keys or scroll buttons • Default view: Current month
          </span>
          <span className="md:hidden">Scroll to see calibrations • Current month view</span>
        </p>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 md:p-4">
            <span className="text-xs md:text-sm font-medium">
              <span className="hidden sm:inline">Timeline Details ({equipment.length} items scheduled)</span>
              <span className="sm:hidden">Details ({equipment.length} items)</span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all duration-300 ease-in-out">
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              <div className="overflow-x-auto">
                <div className="flex items-center justify-center space-x-4 md:space-x-8 py-3 md:py-4 bg-gray-50 rounded-lg min-w-max">
                  {timelineMonths.map((month) => (
                    <div
                      key={month.key}
                      className={`text-center p-2 rounded transition-all min-w-[80px] ${
                        month.isCurrentMonth ? "bg-jefferson-bright-blue text-white" : "hover:bg-gray-200"
                      }`}
                    >
                      <div className="text-xs md:text-sm font-medium">{getMonthName(month.date.getMonth())}</div>
                      <div className="text-xs text-gray-500">{month.date.getFullYear()}</div>
                      <div className="text-xs mt-1">{month.equipment.length} items</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-h-80 md:max-h-96 overflow-y-auto smooth-scroll space-y-3 md:space-y-4">
                {timelineMonths.map((month) => (
                  <div key={month.key} className="border-l-2 md:border-l-4 border-gray-200 pl-3 md:pl-4">
                    <div className="flex items-center mb-2 md:mb-3">
                      <div
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full mr-2 md:mr-3 ${
                          month.isCurrentMonth ? "bg-jefferson-bright-blue" : "bg-gray-300"
                        }`}
                      />
                      <h3 className="font-semibold text-sm md:text-base text-jefferson-deep-blue">
                        <span className="hidden sm:inline">
                          {getMonthName(month.date.getMonth())} {month.date.getFullYear()}
                        </span>
                        <span className="sm:hidden">
                          {getMonthName(month.date.getMonth()).slice(0, 3)} {month.date.getFullYear()}
                        </span>
                      </h3>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {month.equipment.length}
                      </Badge>
                    </div>

                    {month.equipment.length === 0 ? (
                      <p className="text-xs md:text-sm text-gray-500 ml-4 md:ml-6 mb-3 md:mb-4">
                        No calibrations scheduled
                      </p>
                    ) : (
                      <div className="space-y-2 ml-4 md:ml-6">
                        {month.equipment
                          .sort(
                            (a, b) =>
                              new Date(a.next_calibration_date).getTime() - new Date(b.next_calibration_date).getTime(),
                          )
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 bg-white border rounded-lg hover:shadow-sm transition-all space-y-2 sm:space-y-0"
                            >
                              <div className="flex items-center space-x-2 md:space-x-3">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(item)}`} />
                                <div>
                                  <h4 className="font-medium text-xs md:text-sm">{item.name}</h4>
                                  <p className="text-xs text-gray-500">
                                    {item.equipment_type_name} • {item.assigned_person}
                                  </p>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="text-xs font-medium">
                                  {new Date(item.next_calibration_date).toLocaleDateString()}
                                </div>
                                <Badge variant="outline" className={`text-xs ${getStatusTextColor(item)}`}>
                                  {item.calibration_status_name}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
