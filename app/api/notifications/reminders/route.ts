import { type NextRequest, NextResponse } from "next/server"
import { getEquipment } from "@/lib/database"
import { getEmailSettings } from "@/lib/admin-database"
import { sendCalibrationReminder } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const emailSettings = await getEmailSettings()
    const settingsMap = emailSettings.reduce(
      (acc, setting) => {
        acc[setting.setting_name] = setting.setting_value
        return acc
      },
      {} as Record<string, string>,
    )

    const reminderDays = settingsMap.reminder_days_before?.split(",").map((d) => Number.parseInt(d.trim())) || [30, 7]

    const allEquipment = await getEquipment()
    const today = new Date()

    for (const equipment of allEquipment) {
      const dueDate = new Date(equipment.next_calibration_date)
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (reminderDays.includes(daysUntilDue)) {
        await sendCalibrationReminder({
          equipment,
          daysUntilDue,
          recipient: equipment.assigned_person,
          fromName: settingsMap.email_from_name || "Jefferson Medical Physics",
          fromEmail: settingsMap.email_from_address || "medical.physics@jefferson.edu",
          signature: settingsMap.email_signature || "",
        })
      }
    }

    return NextResponse.json({ message: "Reminders sent successfully" })
  } catch (error) {
    console.error("Error sending reminders:", error)
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 })
  }
}
