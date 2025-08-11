import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Database utility functions
export async function getEquipment() {
  const result = await sql`
    SELECT 
      e.*,
      et.name as equipment_type_name,
      cs.name as calibration_status_name,
      cs.color as status_color,
      cs.is_overdue,
      cs.is_in_progress,
      cs.is_completed
    FROM equipment e
    LEFT JOIN equipment_types et ON e.equipment_type_id = et.id
    LEFT JOIN calibration_statuses cs ON e.calibration_status_id = cs.id
    ORDER BY e.next_calibration_date ASC
  `
  return result
}

export async function getEquipmentTypes() {
  const result = await sql`SELECT * FROM equipment_types ORDER BY name`
  return result
}

export async function getCalibrationStatuses() {
  const result = await sql`SELECT * FROM calibration_statuses ORDER BY name`
  return result
}

export async function getOverdueEquipment() {
  const result = await sql`
    SELECT 
      e.*,
      et.name as equipment_type_name,
      cs.name as calibration_status_name
    FROM equipment e
    LEFT JOIN equipment_types et ON e.equipment_type_id = et.id
    LEFT JOIN calibration_statuses cs ON e.calibration_status_id = cs.id
    WHERE e.next_calibration_date < CURRENT_DATE
    ORDER BY e.next_calibration_date ASC
  `
  return result
}

export async function getInProgressEquipment() {
  const result = await sql`
    SELECT 
      e.*,
      et.name as equipment_type_name
    FROM equipment e
    LEFT JOIN equipment_types et ON e.equipment_type_id = et.id
    LEFT JOIN calibration_statuses cs ON e.calibration_status_id = cs.id
    WHERE cs.is_in_progress = true
    ORDER BY e.updated_at DESC
  `
  return result
}

export async function getAllUsers() {
  const result = await sql`
    SELECT 
      id,
      name,
      email,
      created_at,
      updated_at
    FROM neon_auth.users_sync 
    ORDER BY name ASC
  `
  return result
}

export async function logChange(
  tableName: string,
  recordId: number,
  action: string,
  oldValues: any,
  newValues: any,
  userId: string,
  changedBy: string,
) {
  await sql`
    INSERT INTO change_logs (table_name, record_id, action, old_values, new_values, user_id, changed_by)
    VALUES (${tableName}, ${recordId}, ${action}, ${JSON.stringify(oldValues)}, ${JSON.stringify(newValues)}, ${userId}, ${changedBy})
  `
}

export async function getEquipmentWithFilters(filters: {
  equipmentType?: string
  status?: string
  assignedPerson?: string
  location?: string
  search?: string
}) {
  let query = `
    SELECT 
      e.*,
      et.name as equipment_type_name,
      cs.name as calibration_status_name,
      cs.color as status_color,
      cs.is_overdue,
      cs.is_in_progress,
      cs.is_completed
    FROM equipment e
    LEFT JOIN equipment_types et ON e.equipment_type_id = et.id
    LEFT JOIN calibration_statuses cs ON e.calibration_status_id = cs.id
    WHERE 1=1
  `

  const params: any[] = []
  let paramIndex = 1

  if (filters.equipmentType) {
    query += ` AND et.name = $${paramIndex}`
    params.push(filters.equipmentType)
    paramIndex++
  }

  if (filters.status) {
    if (filters.status === "overdue") {
      query += ` AND cs.is_overdue = true`
    } else if (filters.status === "in-progress") {
      query += ` AND cs.is_in_progress = true`
    } else if (filters.status === "due-soon") {
      query += ` AND e.next_calibration_date <= CURRENT_DATE + INTERVAL '30 days' AND cs.is_overdue = false`
    } else {
      query += ` AND cs.name = $${paramIndex}`
      params.push(filters.status)
      paramIndex++
    }
  }

  if (filters.assignedPerson) {
    query += ` AND e.assigned_person ILIKE $${paramIndex}`
    params.push(`%${filters.assignedPerson}%`)
    paramIndex++
  }

  if (filters.location) {
    query += ` AND e.location ILIKE $${paramIndex}`
    params.push(`%${filters.location}%`)
    paramIndex++
  }

  if (filters.search) {
    query += ` AND (
      e.name ILIKE $${paramIndex} OR 
      e.description ILIKE $${paramIndex} OR 
      e.serial_number ILIKE $${paramIndex} OR 
      e.manufacturer ILIKE $${paramIndex} OR 
      e.model ILIKE $${paramIndex} OR
      e.assigned_person ILIKE $${paramIndex}
    )`
    params.push(`%${filters.search}%`)
    paramIndex++
  }

  query += ` ORDER BY e.next_calibration_date ASC`

  const result = await sql.unsafe(query, params)
  return result
}

export async function getChangeLogs(limit = 50, offset = 0) {
  const result = await sql`
    SELECT 
      cl.*,
      u.name as user_name,
      u.email as user_email
    FROM change_logs cl
    LEFT JOIN neon_auth.users_sync u ON cl.user_id = u.id
    ORDER BY cl.changed_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return result
}

export async function getChangeLogsForEquipment(equipmentId: number) {
  const result = await sql`
    SELECT 
      cl.*,
      u.name as user_name,
      u.email as user_email
    FROM change_logs cl
    LEFT JOIN neon_auth.users_sync u ON cl.user_id = u.id
    WHERE cl.table_name = 'equipment' AND cl.record_id = ${equipmentId}
    ORDER BY cl.changed_at DESC
  `
  return result
}
