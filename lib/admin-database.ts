import { sql } from "./database"

export async function getCustomFields() {
  const result = await sql`
    SELECT * FROM custom_fields 
    ORDER BY table_name, display_order
  `
  return result
}

export async function getEmailSettings() {
  const result = await sql`
    SELECT * FROM email_settings 
    ORDER BY setting_name
  `
  return result
}

export async function createEquipmentType(name: string, description: string) {
  const result = await sql`
    INSERT INTO equipment_types (name, description, created_at, updated_at)
    VALUES (${name}, ${description}, NOW(), NOW())
    RETURNING *
  `
  return result[0]
}

export async function updateEquipmentType(id: number, name: string, description: string) {
  const result = await sql`
    UPDATE equipment_types 
    SET name = ${name}, description = ${description}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function deleteEquipmentType(id: number) {
  await sql`DELETE FROM equipment_types WHERE id = ${id}`
}

export async function createCalibrationStatus(
  name: string,
  color: string,
  isOverdue: boolean,
  isInProgress: boolean,
  isCompleted: boolean,
) {
  const result = await sql`
    INSERT INTO calibration_statuses (name, color, is_overdue, is_in_progress, is_completed, created_at, updated_at)
    VALUES (${name}, ${color}, ${isOverdue}, ${isInProgress}, ${isCompleted}, NOW(), NOW())
    RETURNING *
  `
  return result[0]
}

export async function updateCalibrationStatus(
  id: number,
  name: string,
  color: string,
  isOverdue: boolean,
  isInProgress: boolean,
  isCompleted: boolean,
) {
  const result = await sql`
    UPDATE calibration_statuses 
    SET name = ${name}, color = ${color}, is_overdue = ${isOverdue}, 
        is_in_progress = ${isInProgress}, is_completed = ${isCompleted}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function deleteCalibrationStatus(id: number) {
  await sql`DELETE FROM calibration_statuses WHERE id = ${id}`
}

export async function createCustomField(
  tableName: string,
  fieldName: string,
  fieldType: string,
  isRequired: boolean,
  fieldOptions: any,
  displayOrder: number,
) {
  const result = await sql`
    INSERT INTO custom_fields (table_name, field_name, field_type, is_required, field_options, display_order, created_at, updated_at)
    VALUES (${tableName}, ${fieldName}, ${fieldType}, ${isRequired}, ${JSON.stringify(fieldOptions)}, ${displayOrder}, NOW(), NOW())
    RETURNING *
  `
  return result[0]
}

export async function updateCustomField(
  id: number,
  fieldName: string,
  fieldType: string,
  isRequired: boolean,
  fieldOptions: any,
  displayOrder: number,
) {
  const result = await sql`
    UPDATE custom_fields 
    SET field_name = ${fieldName}, field_type = ${fieldType}, is_required = ${isRequired}, 
        field_options = ${JSON.stringify(fieldOptions)}, display_order = ${displayOrder}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function deleteCustomField(id: number) {
  await sql`DELETE FROM custom_fields WHERE id = ${id}`
}

export async function updateEmailSetting(settingName: string, settingValue: string) {
  const result = await sql`
    UPDATE email_settings 
    SET setting_value = ${settingValue}, updated_at = NOW()
    WHERE setting_name = ${settingName}
    RETURNING *
  `
  return result[0]
}
