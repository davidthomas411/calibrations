import { type NextRequest, NextResponse } from "next/server"
import { createEquipmentType, updateEquipmentType, deleteEquipmentType } from "@/lib/admin-database"
import { logChange } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()
    const newType = await createEquipmentType(name, description)

    await logChange("equipment_types", newType.id, "CREATE", {}, newType, "system", "Admin User")

    return NextResponse.json(newType)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create equipment type" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json()
    const updatedType = await updateEquipmentType(id, name, description)

    await logChange("equipment_types", id, "UPDATE", {}, updatedType, "system", "Admin User")

    return NextResponse.json(updatedType)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update equipment type" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    await logChange("equipment_types", id, "DELETE", { id }, {}, "system", "Admin User")

    await deleteEquipmentType(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete equipment type" }, { status: 500 })
  }
}
