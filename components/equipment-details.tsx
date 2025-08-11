"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, X, Calendar, User, MapPin, Settings, FileText } from "lucide-react"

interface Equipment {
  id: number
  name: string
  description: string
  serial_number: string
  manufacturer: string
  model: string
  equipment_type_name: string
  calibration_status_name: string
  last_calibration_date: string
  next_calibration_date: string
  assigned_person: string
  location: string
  calibration_frequency_months: number
  custom_fields?: any
}

interface EquipmentDetailsProps {
  equipment: Equipment
  onClose: () => void
}

export function EquipmentDetails({ equipment, onClose }: EquipmentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const customFields = equipment.custom_fields ? JSON.parse(equipment.custom_fields) : {}

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-jefferson-deep-blue">Equipment Details</DialogTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold text-lg text-jefferson-deep-blue mb-3">{equipment.name}</h3>
            <div className="flex space-x-2 mb-4">
              <Badge variant="outline">{equipment.equipment_type_name}</Badge>
              <Badge className="bg-green-100 text-green-800">{equipment.calibration_status_name}</Badge>
            </div>
            <p className="text-gray-600">{equipment.description}</p>
          </div>

          <Separator />

          {/* Equipment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Serial Number</label>
              <p className="font-mono">{equipment.serial_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Manufacturer</label>
              <p>{equipment.manufacturer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Model</label>
              <p>{equipment.model}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Calibration Frequency</label>
              <p>{equipment.calibration_frequency_months} months</p>
            </div>
          </div>

          <Separator />

          {/* Assignment & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned Person</label>
                <p>{equipment.assigned_person}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p>{equipment.location}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Calibration Information */}
          <div>
            <h4 className="font-medium text-jefferson-deep-blue mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Calibration Status
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Last Calibration</label>
                <p>{new Date(equipment.last_calibration_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Next Due Date</label>
                <p className="font-medium">{new Date(equipment.next_calibration_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {Object.keys(customFields).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-jefferson-deep-blue mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Additional Information
                </h4>
                <div className="space-y-3">
                  {Object.entries(customFields).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</label>
                      <p className="text-sm">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90">
              <FileText className="w-4 h-4 mr-2" />
              View Calibration History
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Calibration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
