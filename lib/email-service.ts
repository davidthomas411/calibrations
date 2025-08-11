// Email service for sending notifications
// Note: In a real implementation, you would integrate with an email service like SendGrid, AWS SES, or similar

interface WeeklyReportData {
  recipients: string[]
  totalEquipment: number
  overdueEquipment: any[]
  inProgressEquipment: any[]
  upcomingEquipment: any[]
  fromName: string
  fromEmail: string
  signature: string
}

interface CalibrationReminderData {
  equipment: any
  daysUntilDue: number
  recipient: string
  fromName: string
  fromEmail: string
  signature: string
}

export async function sendWeeklyReport(data: WeeklyReportData) {
  const subject = `Weekly Calibration Report - ${new Date().toLocaleDateString()}`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #152456; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; }
        .summary-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px; }
        .overdue { background-color: #fee; border-left: 4px solid #e53e30; }
        .in-progress { background-color: #eff8ff; border-left: 4px solid #3b82f6; }
        .upcoming { background-color: #fef3cd; border-left: 4px solid #f59e0b; }
        .equipment-list { margin: 15px 0; }
        .equipment-item { padding: 10px; border-bottom: 1px solid #eee; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Weekly Calibration Report</h1>
        <p>Thomas Jefferson University - Medical Physics Division</p>
      </div>
      
      <div class="content">
        <h2>Summary</h2>
        <div class="summary">
          <div class="summary-card">
            <h3>${data.totalEquipment}</h3>
            <p>Total Equipment</p>
          </div>
          <div class="summary-card" style="background-color: #fee;">
            <h3>${data.overdueEquipment.length}</h3>
            <p>Overdue</p>
          </div>
          <div class="summary-card" style="background-color: #eff8ff;">
            <h3>${data.inProgressEquipment.length}</h3>
            <p>In Progress</p>
          </div>
          <div class="summary-card" style="background-color: #fef3cd;">
            <h3>${data.upcomingEquipment.length}</h3>
            <p>Due Soon</p>
          </div>
        </div>

        ${
          data.overdueEquipment.length > 0
            ? `
        <div class="overdue">
          <h3>⚠️ Overdue Equipment (${data.overdueEquipment.length})</h3>
          <div class="equipment-list">
            ${data.overdueEquipment
              .map(
                (eq) => `
              <div class="equipment-item">
                <strong>${eq.name}</strong> (${eq.equipment_type_name})<br>
                Due: ${new Date(eq.next_calibration_date).toLocaleDateString()}<br>
                Assigned: ${eq.assigned_person}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        ${
          data.inProgressEquipment.length > 0
            ? `
        <div class="in-progress">
          <h3>🔄 In Progress Calibrations (${data.inProgressEquipment.length})</h3>
          <div class="equipment-list">
            ${data.inProgressEquipment
              .map(
                (eq) => `
              <div class="equipment-item">
                <strong>${eq.name}</strong> (${eq.equipment_type_name})<br>
                Assigned: ${eq.assigned_person}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        ${
          data.upcomingEquipment.length > 0
            ? `
        <div class="upcoming">
          <h3>📅 Upcoming Calibrations (${data.upcomingEquipment.length})</h3>
          <div class="equipment-list">
            ${data.upcomingEquipment
              .map(
                (eq) => `
              <div class="equipment-item">
                <strong>${eq.name}</strong> (${eq.equipment_type_name})<br>
                Due: ${new Date(eq.next_calibration_date).toLocaleDateString()}<br>
                Assigned: ${eq.assigned_person}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>

      <div class="footer">
        <p>${data.signature.replace(/\n/g, "<br>")}</p>
        <p>This is an automated report from the Calibration Equipment Tracker system.</p>
      </div>
    </body>
    </html>
  `

  console.log("Sending weekly report to:", data.recipients)
  console.log("Subject:", subject)
  console.log("HTML Content:", htmlContent)

  // Simulate email sending
  return Promise.resolve({ success: true, messageId: `weekly-${Date.now()}` })
}

export async function sendCalibrationReminder(data: CalibrationReminderData) {
  const subject = `Calibration Reminder: ${data.equipment.name} - Due in ${data.daysUntilDue} days`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #152456; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert { background-color: #fef3cd; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .equipment-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Calibration Reminder</h1>
        <p>Thomas Jefferson University - Medical Physics Division</p>
      </div>
      
      <div class="content">
        <div class="alert">
          <h2>⏰ Calibration Due in ${data.daysUntilDue} days</h2>
          <p>This is a reminder that the following equipment requires calibration soon.</p>
        </div>

        <div class="equipment-details">
          <h3>Equipment Details</h3>
          <p><strong>Name:</strong> ${data.equipment.name}</p>
          <p><strong>Type:</strong> ${data.equipment.equipment_type_name}</p>
          <p><strong>Serial Number:</strong> ${data.equipment.serial_number}</p>
          <p><strong>Manufacturer:</strong> ${data.equipment.manufacturer}</p>
          <p><strong>Model:</strong> ${data.equipment.model}</p>
          <p><strong>Location:</strong> ${data.equipment.location}</p>
          <p><strong>Due Date:</strong> ${new Date(data.equipment.next_calibration_date).toLocaleDateString()}</p>
          <p><strong>Last Calibration:</strong> ${new Date(data.equipment.last_calibration_date).toLocaleDateString()}</p>
        </div>

        <p>Please schedule the calibration as soon as possible to ensure compliance with safety regulations.</p>
        
        <p>If you have any questions or need to update the calibration schedule, please contact the Medical Physics Division.</p>
      </div>

      <div class="footer">
        <p>${data.signature.replace(/\n/g, "<br>")}</p>
        <p>This is an automated reminder from the Calibration Equipment Tracker system.</p>
      </div>
    </body>
    </html>
  `

  console.log("Sending calibration reminder to:", data.recipient)
  console.log("Subject:", subject)
  console.log("HTML Content:", htmlContent)

  // Simulate email sending
  return Promise.resolve({ success: true, messageId: `reminder-${Date.now()}` })
}

export async function sendCalibrationCompleteNotification(
  equipmentName: string,
  recipient: string,
  completedBy: string,
) {
  const subject = `Calibration Complete: ${equipmentName}`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #152456; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success { background-color: #d1fae5; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Calibration Complete</h1>
        <p>Thomas Jefferson University - Medical Physics Division</p>
      </div>
      
      <div class="content">
        <div class="success">
          <h2>✅ Calibration Successfully Completed</h2>
          <p><strong>Equipment:</strong> ${equipmentName}</p>
          <p><strong>Completed by:</strong> ${completedBy}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>The calibration has been recorded in the system and the next calibration date has been updated.</p>
      </div>

      <div class="footer">
        <p>This is an automated notification from the Calibration Equipment Tracker system.</p>
      </div>
    </body>
    </html>
  `

  console.log("Sending completion notification to:", recipient)
  console.log("Subject:", subject)

  return Promise.resolve({ success: true, messageId: `complete-${Date.now()}` })
}
