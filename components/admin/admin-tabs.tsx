"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EquipmentTypesManager } from "./equipment-types-manager"
import { CalibrationStatusManager } from "./calibration-status-manager"
import { CustomFieldsManager } from "./custom-fields-manager"
import { EmailSettingsManager } from "./email-settings-manager"
import { UserManager } from "./user-manager"
import { Users, Mail, Database, Tags, Wrench } from "lucide-react"

interface AdminTabsProps {
  equipmentTypes: any[]
  calibrationStatuses: any[]
  users: any[]
  customFields: any[]
  emailSettings: any[]
}

export function AdminTabs({ equipmentTypes, calibrationStatuses, users, customFields, emailSettings }: AdminTabsProps) {
  return (
    <Tabs defaultValue="equipment-types" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 bg-white">
        <TabsTrigger value="equipment-types" className="flex items-center space-x-2">
          <Wrench className="w-4 h-4" />
          <span>Equipment Types</span>
        </TabsTrigger>
        <TabsTrigger value="calibration-status" className="flex items-center space-x-2">
          <Tags className="w-4 h-4" />
          <span>Calibration Status</span>
        </TabsTrigger>
        <TabsTrigger value="custom-fields" className="flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Custom Fields</span>
        </TabsTrigger>
        <TabsTrigger value="email-settings" className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Email Settings</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Users</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="equipment-types">
        <EquipmentTypesManager equipmentTypes={equipmentTypes} />
      </TabsContent>

      <TabsContent value="calibration-status">
        <CalibrationStatusManager calibrationStatuses={calibrationStatuses} />
      </TabsContent>

      <TabsContent value="custom-fields">
        <CustomFieldsManager customFields={customFields} />
      </TabsContent>

      <TabsContent value="email-settings">
        <EmailSettingsManager emailSettings={emailSettings} />
      </TabsContent>

      <TabsContent value="users">
        <UserManager users={users} />
      </TabsContent>
    </Tabs>
  )
}
