import { type NextRequest, NextResponse } from "next/server"
import { getEquipmentWithFilters, getEquipmentTypes } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      equipmentType: searchParams.get("equipmentType") || undefined,
      status: searchParams.get("status") || undefined,
      assignedPerson: searchParams.get("assignedPerson") || undefined,
      location: searchParams.get("location") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const [equipment, equipmentTypes] = await Promise.all([getEquipmentWithFilters(filters), getEquipmentTypes()])

    return NextResponse.json({ equipment, equipmentTypes })
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}
