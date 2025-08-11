import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface InProgressEquipment {
  id: number
  name: string
  equipment_type_name: string
  assigned_person: string
  updated_at: string
}

interface InProgressPanelProps {
  equipment: InProgressEquipment[]
}

export function InProgressPanel({ equipment }: InProgressPanelProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-jefferson-deep-blue">
          <Clock className="w-5 h-5 mr-2" />
          In Progress Calibrations ({equipment.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {equipment.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Assigned to: {item.assigned_person}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">{item.equipment_type_name}</Badge>
                <p className="text-xs text-gray-500 mt-1">Updated: {new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
