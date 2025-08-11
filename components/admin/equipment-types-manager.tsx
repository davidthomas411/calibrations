"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EquipmentType {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

interface EquipmentTypesManagerProps {
  equipmentTypes: EquipmentType[]
}

export function EquipmentTypesManager({ equipmentTypes }: EquipmentTypesManagerProps) {
  const [types, setTypes] = useState(equipmentTypes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<EquipmentType | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingType) {
        // Update existing type
        const response = await fetch("/api/admin/equipment-types", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingType.id, ...formData }),
        })

        if (response.ok) {
          const updatedType = await response.json()
          setTypes(types.map((t) => (t.id === editingType.id ? updatedType : t)))
          toast({ title: "Equipment type updated successfully" })
        }
      } else {
        // Create new type
        const response = await fetch("/api/admin/equipment-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newType = await response.json()
          setTypes([...types, newType])
          toast({ title: "Equipment type created successfully" })
        }
      }

      setIsDialogOpen(false)
      setEditingType(null)
      setFormData({ name: "", description: "" })
    } catch (error) {
      toast({ title: "Error saving equipment type", variant: "destructive" })
    }
  }

  const handleEdit = (type: EquipmentType) => {
    setEditingType(type)
    setFormData({ name: type.name, description: type.description })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this equipment type?")) return

    try {
      const response = await fetch("/api/admin/equipment-types", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setTypes(types.filter((t) => t.id !== id))
        toast({ title: "Equipment type deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error deleting equipment type", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-jefferson-deep-blue">
            <Wrench className="w-5 h-5 mr-2" />
            Equipment Types Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
                onClick={() => {
                  setEditingType(null)
                  setFormData({ name: "", description: "" })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingType ? "Edit Equipment Type" : "Add New Equipment Type"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Ion Chamber"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this equipment type"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-jefferson-bright-blue text-jefferson-deep-blue">
                    {editingType ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {types.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Created: {new Date(type.created_at).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(type)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(type.id)}>
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
