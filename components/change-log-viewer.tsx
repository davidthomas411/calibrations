"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Eye, User, Calendar, Database } from "lucide-react"

interface ChangeLog {
  id: number
  table_name: string
  record_id: number
  action: string
  old_values: any
  new_values: any
  changed_at: string
  changed_by: string
  user_name: string
  user_email: string
}

interface ChangeLogViewerProps {
  equipmentId?: number
}

export function ChangeLogViewer({ equipmentId }: ChangeLogViewerProps) {
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<ChangeLog | null>(null)

  const fetchChangeLogs = async () => {
    setIsLoading(true)
    try {
      const url = equipmentId ? `/api/change-logs?equipmentId=${equipmentId}` : "/api/change-logs"

      const response = await fetch(url)
      if (response.ok) {
        const logs = await response.json()
        setChangeLogs(logs)
      }
    } catch (error) {
      console.error("Error fetching change logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChangeLogs()
  }, [equipmentId])

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-jefferson-deep-blue">
            <History className="w-5 h-5 mr-2" />
            Change Log {equipmentId ? `(Equipment #${equipmentId})` : "(All Changes)"}
          </CardTitle>
          <Button onClick={fetchChangeLogs} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {changeLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getActionColor(log.action)}>{log.action.toUpperCase()}</Badge>
                    <span className="text-sm font-medium">{log.table_name}</span>
                    <span className="text-sm text-gray-500">#{log.record_id}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {log.user_name || log.changed_by}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(log.changed_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Change Details - {log.action.toUpperCase()} {log.table_name} #{log.record_id}
                      </DialogTitle>
                    </DialogHeader>

                    {selectedLog && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="font-medium text-gray-700">Changed By:</label>
                            <p>{selectedLog.user_name || selectedLog.changed_by}</p>
                          </div>
                          <div>
                            <label className="font-medium text-gray-700">Date & Time:</label>
                            <p>{new Date(selectedLog.changed_at).toLocaleString()}</p>
                          </div>
                        </div>

                        {selectedLog.action.toLowerCase() !== "create" && selectedLog.old_values && (
                          <div>
                            <label className="font-medium text-gray-700 block mb-2">Previous Values:</label>
                            <pre className="bg-red-50 p-3 rounded text-xs overflow-x-auto">
                              {formatValue(selectedLog.old_values)}
                            </pre>
                          </div>
                        )}

                        {selectedLog.action.toLowerCase() !== "delete" && selectedLog.new_values && (
                          <div>
                            <label className="font-medium text-gray-700 block mb-2">New Values:</label>
                            <pre className="bg-green-50 p-3 rounded text-xs overflow-x-auto">
                              {formatValue(selectedLog.new_values)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}

            {changeLogs.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No change logs found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
