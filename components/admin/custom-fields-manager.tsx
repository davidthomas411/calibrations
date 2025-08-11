"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomField {
  id: number
  table_name: string
  field_name: string
  field_type: string
  is_required: boolean
  field_options: any
  display_order: number
  created_at: string
  updated_at: string
}

interface CustomFieldsManagerProps {
  customFields: CustomField[]
}

export function CustomFieldsManager({ customFields }: CustomFieldsManagerProps) {
  const [fields, setFields] = useState(customFields)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [formData, setFormData] = useState({
    table_name: "equipment",
    field_name: "",
    field_type: "text",
    is_required: false,
    field_options: {},
    display_order: 1,
  })
  const { toast } = useToast()

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Text Area" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "select", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
    { value: "email", label: "Email" },
    { value: "url", label: "URL" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingField) {
        // Update existing field
        const response = await fetch("/api/admin/custom-fields", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingField.id, ...formData }),
        })

        if (response.ok) {
          const updatedField = await response.json()
          setFields(fields.map((f) => (f.id === editingField.id ? updatedField : f)))
          toast({ title: "Custom field updated successfully" })
        }
      } else {
        // Create new field
        const response = await fetch("/api/admin/custom-fields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newField = await response.json()
          setFields([...fields, newField])
          toast({ title: "Custom field created successfully" })
        }
      }

      setIsDialogOpen(false)
      setEditingField(null)
      setFormData({
        table_name: "equipment",
        field_name: "",
        field_type: "text",
        is_required: false,
        field_options: {},
        display_order: 1,
      })
    } catch (error) {
      toast({ title: "Error saving custom field", variant: "destructive" })
    }
  }

  const handleEdit = (field: CustomField) => {
    setEditingField(field)
    setFormData({
      table_name: field.table_name,
      field_name: field.field_name,
      field_type: field.field_type,
      is_required: field.is_required,
      field_options: field.field_options || {},
      display_order: field.display_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this custom field?")) return

    try {
      const response = await fetch("/api/admin/custom-fields", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setFields(fields.filter((f) => f.id !== id))
        toast({ title: "Custom field deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error deleting custom field", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-jefferson-deep-blue">
            <Database className="w-5 h-5 mr-2" />
            Custom Fields Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
                onClick={() => {
                  setEditingField(null)
                  setFormData({
                    table_name: "equipment",
                    field_name: "",
                    field_type: "text",
                    is_required: false,
                    field_options: {},
                    display_order: 1,
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Field
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingField ? "Edit Custom Field" : "Add New Custom Field"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="table_name">Table</Label>
                  <Select
                    value={formData.table_name}
                    onValueChange={(value) => setFormData({ ...formData, table_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="calibrations">Calibrations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="field_name">Field Name</Label>
                  <Input
                    id="field_name"
                    value={formData.field_name}
                    onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                    placeholder="e.g., vendor_contact, warranty_date"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="field_type">Field Type</Label>
                  <Select
                    value={formData.field_type}
                    onValueChange={(value) => setFormData({ ...formData, field_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked as boolean })}
                  />
                  <Label htmlFor="is_required">Required Field</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-jefferson-bright-blue text-jefferson-deep-blue">
                    {editingField ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{field.field_name}</h3>
                <div className="flex space-x-2 mt-1">
                  <Badge variant="outline">{field.table_name}</Badge>
                  <Badge variant="outline">{field.field_type}</Badge>
                  {field.is_required && <Badge className="bg-red-100 text-red-800">Required</Badge>}
                </div>
                <p className="text-xs text-gray-500 mt-1">Order: {field.display_order}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(field)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(field.id)}>
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
