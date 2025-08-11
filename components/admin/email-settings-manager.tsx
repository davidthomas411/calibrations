"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Mail, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailSetting {
  id: number
  setting_name: string
  setting_value: string
  description: string
  created_at: string
  updated_at: string
}

interface EmailSettingsManagerProps {
  emailSettings: EmailSetting[]
}

export function EmailSettingsManager({ emailSettings }: EmailSettingsManagerProps) {
  const [settings, setSettings] = useState(
    emailSettings.reduce(
      (acc, setting) => {
        acc[setting.setting_name] = setting.setting_value
        return acc
      },
      {} as Record<string, string>,
    ),
  )
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({ title: "Email settings saved successfully" })
      }
    } catch (error) {
      toast({ title: "Error saving email settings", variant: "destructive" })
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-jefferson-deep-blue">
            <Mail className="w-5 h-5 mr-2" />
            Email Notification Settings
          </CardTitle>
          <Button
            onClick={handleSave}
            className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Report Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-jefferson-deep-blue">Weekly Reports</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly_report_enabled">Enable Weekly Reports</Label>
              <p className="text-sm text-gray-600">Send weekly calibration status reports</p>
            </div>
            <Switch
              id="weekly_report_enabled"
              checked={settings.weekly_report_enabled === "true"}
              onCheckedChange={(checked) => updateSetting("weekly_report_enabled", checked.toString())}
            />
          </div>

          <div>
            <Label htmlFor="report_day">Report Day</Label>
            <Select
              value={settings.report_day || "monday"}
              onValueChange={(value) => updateSetting("report_day", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="report_recipients">Report Recipients</Label>
            <Textarea
              id="report_recipients"
              value={settings.report_recipients || ""}
              onChange={(e) => updateSetting("report_recipients", e.target.value)}
              placeholder="email1@jefferson.edu, email2@jefferson.edu"
              rows={3}
            />
            <p className="text-sm text-gray-600 mt-1">Separate multiple emails with commas</p>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-jefferson-deep-blue">Calibration Reminders</h3>

          <div>
            <Label htmlFor="reminder_days_before">Reminder Days</Label>
            <Input
              id="reminder_days_before"
              value={settings.reminder_days_before || "30,7"}
              onChange={(e) => updateSetting("reminder_days_before", e.target.value)}
              placeholder="30,7,1"
            />
            <p className="text-sm text-gray-600 mt-1">Days before due date to send reminders (comma-separated)</p>
          </div>
        </div>

        {/* Email Template Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-jefferson-deep-blue">Email Templates</h3>

          <div>
            <Label htmlFor="email_from_name">From Name</Label>
            <Input
              id="email_from_name"
              value={settings.email_from_name || "Jefferson Medical Physics"}
              onChange={(e) => updateSetting("email_from_name", e.target.value)}
              placeholder="Jefferson Medical Physics"
            />
          </div>

          <div>
            <Label htmlFor="email_from_address">From Email Address</Label>
            <Input
              id="email_from_address"
              type="email"
              value={settings.email_from_address || "medical.physics@jefferson.edu"}
              onChange={(e) => updateSetting("email_from_address", e.target.value)}
              placeholder="medical.physics@jefferson.edu"
            />
          </div>

          <div>
            <Label htmlFor="email_signature">Email Signature</Label>
            <Textarea
              id="email_signature"
              value={settings.email_signature || ""}
              onChange={(e) => updateSetting("email_signature", e.target.value)}
              placeholder="Best regards,&#10;Medical Physics Division&#10;Thomas Jefferson University"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
