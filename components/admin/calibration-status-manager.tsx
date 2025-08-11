"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Tags } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CalibrationStatus {
  id: number
  name: string
  color: string
  is_overdue: boolean
  is_in_progress: boolean
  is_completed: boolean
  created_at: string
  updated_at: string
}

interface CalibrationStatusManagerProps {
  calibrationStatuses: CalibrationStatus[]
}

export function CalibrationStatusManager({ calibrationStatuses }: CalibrationStatusManagerProps) {
  const [statuses, setStatuses] = useState(calibrationStatuses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<CalibrationStatus | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "#22c55e",
    is_overdue: false,
    is_in_progress: false,
    is_completed: false,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingStatus) {
        // Update existing status
        const response = await fetch("/api/admin/calibration-statuses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingStatus.id, ...formData }),
        })

        if (response.ok) {
          const updatedStatus = await response.json()
          setStatuses(statuses.map((s) => (s.id === editingStatus.id ? updatedStatus : s)))
          toast({ title: "Calibration status updated successfully" })
        }
      } else {
        // Create new status
        const response = await fetch("/api/admin/calibration-statuses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newStatus = await response.json()
          setStatuses([...statuses, newStatus])
          toast({ title: "Calibration status created successfully" })
        }
      }

      setIsDialogOpen(false)
      setEditingStatus(null)
      setFormData({
        name: "",
        color: "#22c55e",
        is_overdue: false,
        is_in_progress: false,
        is_completed: false,
      })
    } catch (error) {
      toast({ title: "Error saving calibration status", variant: "destructive" })
    }
  }

  const handleEdit = (status: CalibrationStatus) => {
    setEditingStatus(status)
    setFormData({
      name: status.name,
      color: status.color,
      is_overdue: status.is_overdue,
      is_in_progress: status.is_in_progress,
      is_completed: status.is_completed,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this calibration status?")) return

    try {
      const response = await fetch("/api/admin/calibration-statuses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setStatuses(statuses.filter((s) => s.id !== id))
        toast({ title: "Calibration status deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error deleting calibration status", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-jefferson-deep-blue">
            <Tags className="w-5 h-5 mr-2" />
            Calibration Status Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
                onClick={() => {
                  setEditingStatus(null)
                  setFormData({
                    name: "",
                    color: "#22c55e",
                    is_overdue: false,
                    is_in_progress: false,
                    is_completed: false,
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStatus ? "Edit Calibration Status" : "Add New Calibration Status"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Status Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Calibrated, Overdue, In Progress"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#22c55e"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Status Properties</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_overdue"
                      checked={formData.is_overdue}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_overdue: checked as boolean })}
                    />
                    <Label htmlFor="is_overdue">Is Overdue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_in_progress"
                      checked={formData.is_in_progress}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_in_progress: checked as boolean })}
                    />
                    <Label htmlFor="is_in_progress">Is In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_completed"
                      checked={formData.is_completed}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_completed: checked as boolean })}
                    />
                    <Label htmlFor="is_completed">Is Completed</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-jefferson-bright-blue text-jefferson-deep-blue">
                    {editingStatus ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }} />
                <div>
                  <h3 className="font-medium">{status.name}</h3>
                  <div className="flex space-x-2 mt-1">
                    {status.is_overdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                    {status.is_in_progress && <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>}
                    {status.is_completed && <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(status)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(status.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
