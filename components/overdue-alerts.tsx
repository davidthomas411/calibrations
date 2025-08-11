import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OverdueEquipment {
  id: number
  name: string
  equipment_type_name: string
  next_calibration_date: string
  assigned_person: string
}

interface OverdueAlertsProps {
  equipment: OverdueEquipment[]
}

export function OverdueAlerts({ equipment }: OverdueAlertsProps) {
  return (
    <Alert className="bg-academic-red/10 border-academic-red">
      <AlertTriangle className="h-4 w-4 text-academic-red" />
      <AlertTitle className="text-academic-red">
        {equipment.length} Equipment Item{equipment.length > 1 ? "s" : ""} Overdue for Calibration
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {equipment.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white/50 p-2 rounded">
              <div>
                <span className="font-medium">{item.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {item.equipment_type_name}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Due: {new Date(item.next_calibration_date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {equipment.length > 3 && <p className="text-sm text-gray-600">...and {equipment.length - 3} more items</p>}
        </div>
      </AlertDescription>
    </Alert>
  )
}
