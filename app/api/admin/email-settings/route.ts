import { type NextRequest, NextResponse } from "next/server"
import { updateEmailSetting } from "@/lib/admin-database"
import { logChange } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()

    for (const [settingName, settingValue] of Object.entries(settings)) {
      await updateEmailSetting(settingName, settingValue as string)
      await logChange("email_settings", 0, "UPDATE", {}, { settingName, settingValue }, "system", "Admin User")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update email settings" }, { status: 500 })
  }
}
