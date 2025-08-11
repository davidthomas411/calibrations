import { type NextRequest, NextResponse } from "next/server"
import { getChangeLogs, getChangeLogsForEquipment } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const equipmentId = searchParams.get("equipmentId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let changeLogs
    if (equipmentId) {
      changeLogs = await getChangeLogsForEquipment(Number.parseInt(equipmentId))
    } else {
      changeLogs = await getChangeLogs(limit, offset)
    }

    return NextResponse.json(changeLogs)
  } catch (error) {
    console.error("Error fetching change logs:", error)
    return NextResponse.json({ error: "Failed to fetch change logs" }, { status: 500 })
  }
}
