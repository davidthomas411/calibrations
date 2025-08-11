import { Suspense } from "react"
import { redirect } from "next/navigation"
import { checkAuth } from "@/lib/auth"
import { getEquipmentTypes, getCalibrationStatuses, getAllUsers } from "@/lib/database"
import { getCustomFields, getEmailSettings } from "@/lib/admin-database"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminTabs } from "@/components/admin/admin-tabs"

export default async function AdminPage() {
  const user = await checkAuth()
  if (!user) {
    redirect("/login")
  }

  const [equipmentTypes, calibrationStatuses, users, customFields, emailSettings] = await Promise.all([
    getEquipmentTypes(),
    getCalibrationStatuses(),
    getAllUsers(),
    getCustomFields(),
    getEmailSettings(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-sm md:text-base">Loading admin panel...</div>
            </div>
          }
        >
          <AdminTabs
            equipmentTypes={equipmentTypes}
            calibrationStatuses={calibrationStatuses}
            users={users}
            customFields={customFields}
            emailSettings={emailSettings}
          />
        </Suspense>
      </main>
    </div>
  )
}
