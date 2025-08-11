import { type NextRequest, NextResponse } from "next/server"
import { createCalibrationStatus, updateCalibrationStatus, deleteCalibrationStatus } from "@/lib/admin-database"
import { logChange } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { name, color, is_overdue, is_in_progress, is_completed } = await request.json()
    const newStatus = await createCalibrationStatus(name, color, is_overdue, is_in_progress, is_completed)

    await logChange("calibration_statuses", newStatus.id, "CREATE", {}, newStatus, "system", "Admin User")

    return NextResponse.json(newStatus)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create calibration status" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, color, is_overdue, is_in_progress, is_completed } = await request.json()
    const updatedStatus = await updateCalibrationStatus(id, name, color, is_overdue, is_in_progress, is_completed)

    await logChange("calibration_statuses", id, "UPDATE", {}, updatedStatus, "system", "Admin User")

    return NextResponse.json(updatedStatus)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update calibration status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    await logChange("calibration_statuses", id, "DELETE", { id }, {}, "system", "Admin User")

    await deleteCalibrationStatus(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete calibration status" }, { status: 500 })
  }
}
