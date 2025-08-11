import { type NextRequest, NextResponse } from "next/server"
import { getEquipment, getOverdueEquipment, getInProgressEquipment } from "@/lib/database"
import { getEmailSettings } from "@/lib/admin-database"
import { sendWeeklyReport } from "@/lib/email-service"

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

    if (settingsMap.weekly_report_enabled !== "true") {
      return NextResponse.json({ message: "Weekly reports are disabled" })
    }

    const [allEquipment, overdueEquipment, inProgressEquipment] = await Promise.all([
      getEquipment(),
      getOverdueEquipment(),
      getInProgressEquipment(),
    ])

    const upcomingEquipment = allEquipment.filter((equipment) => {
      const dueDate = new Date(equipment.next_calibration_date)
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      return dueDate <= thirtyDaysFromNow && dueDate >= today
    })

    const recipients = settingsMap.report_recipients?.split(",").map((email) => email.trim()) || []

    await sendWeeklyReport({
      recipients,
      totalEquipment: allEquipment.length,
      overdueEquipment,
      inProgressEquipment,
      upcomingEquipment,
      fromName: settingsMap.email_from_name || "Jefferson Medical Physics",
      fromEmail: settingsMap.email_from_address || "medical.physics@jefferson.edu",
      signature: settingsMap.email_signature || "",
    })

    return NextResponse.json({ message: "Weekly report sent successfully" })
  } catch (error) {
    console.error("Error sending weekly report:", error)
    return NextResponse.json({ error: "Failed to send weekly report" }, { status: 500 })
  }
}
