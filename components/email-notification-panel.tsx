"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EmailNotificationPanel() {
  const [isSendingReport, setIsSendingReport] = useState(false)
  const [isSendingReminders, setIsSendingReminders] = useState(false)
  const { toast } = useToast()

  const sendWeeklyReport = async () => {
    setIsSendingReport(true)
    try {
      const response = await fetch("/api/notifications/weekly-report", {
        method: "POST",
      })

      if (response.ok) {
        toast({ title: "Weekly report sent successfully" })
      } else {
        toast({ title: "Failed to send weekly report", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error sending weekly report", variant: "destructive" })
    } finally {
      setIsSendingReport(false)
    }
  }

  const sendReminders = async () => {
    setIsSendingReminders(true)
    try {
      const response = await fetch("/api/notifications/reminders", {
        method: "POST",
      })

      if (response.ok) {
        toast({ title: "Calibration reminders sent successfully" })
      } else {
        toast({ title: "Failed to send reminders", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error sending reminders", variant: "destructive" })
    } finally {
      setIsSendingReminders(false)
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-jefferson-deep-blue">
          <Mail className="w-5 h-5 mr-2" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Weekly Calibration Report</h3>
            <p className="text-sm text-gray-600">Send comprehensive status report to configured recipients</p>
            <Badge variant="outline" className="mt-1">
              <Clock className="w-3 h-3 mr-1" />
              Automated: Every Monday
            </Badge>
          </div>
          <Button
            onClick={sendWeeklyReport}
            disabled={isSendingReport}
            className="bg-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue/90"
          >
            {isSendingReport ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Calibration Reminders</h3>
            <p className="text-sm text-gray-600">Send reminders to assigned personnel for upcoming calibrations</p>
            <Badge variant="outline" className="mt-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              Automated: Daily check
            </Badge>
          </div>
          <Button
            onClick={sendReminders}
            disabled={isSendingReminders}
            variant="outline"
            className="border-jefferson-bright-blue text-jefferson-deep-blue hover:bg-jefferson-bright-blue hover:text-white bg-transparent"
          >
            {isSendingReminders ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reminders
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Email Configuration</h4>
          <p className="text-sm text-blue-700">
            Configure email settings, recipients, and schedules in the Admin panel under Email Settings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
