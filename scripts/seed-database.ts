import { sql } from "../lib/database"

async function seedDatabase() {
  console.log("Starting database seeding...")

  // Seed equipment types
  await sql`
    INSERT INTO equipment_types (name, description) VALUES
    ('Ion Chamber', 'Ion chambers for radiation measurement'),
    ('Electrometer', 'Electrometers for charge/current measurement'),
    ('Well Chamber', 'Well chambers for brachytherapy')
    ON CONFLICT (name) DO NOTHING
  `

  // Seed calibration statuses
  await sql`
    INSERT INTO calibration_statuses (name, color, is_overdue, is_in_progress, is_completed) VALUES
    ('Calibrated', '#22c55e', false, false, true),
    ('Due Soon', '#f59e0b', false, false, false),
    ('Overdue', '#ef4444', true, false, false),
    ('In Progress', '#3b82f6', false, true, false),
    ('Pending', '#6b7280', false, false, false)
    ON CONFLICT (name) DO NOTHING
  `

  // Get the IDs for the types and statuses
  const ionChamberType = await sql`SELECT id FROM equipment_types WHERE name = 'Ion Chamber'`
  const electrometerType = await sql`SELECT id FROM equipment_types WHERE name = 'Electrometer'`
  const wellChamberType = await sql`SELECT id FROM equipment_types WHERE name = 'Well Chamber'`

  const calibratedStatus = await sql`SELECT id FROM calibration_statuses WHERE name = 'Calibrated'`
  const dueSoonStatus = await sql`SELECT id FROM calibration_statuses WHERE name = 'Due Soon'`
  const overdueStatus = await sql`SELECT id FROM calibration_statuses WHERE name = 'Overdue'`

  // Seed equipment from the provided data
  const equipmentData = [
    {
      name: "PTW TN30013 Farmer Chamber",
      description: "(Annual) PTW TN30013, SN#2118, 0.6 cm waterproof Farmer",
      serial_number: "SN#2118",
      manufacturer: "PTW",
      model: "TN30013",
      equipment_type_id: ionChamberType[0].id,
      calibration_status_id: calibratedStatus[0].id,
      last_calibration_date: "2023-11-15",
      next_calibration_date: "2025-11-27",
      assigned_person: "Jun Li",
      calibration_frequency_months: 24,
      location: "Medical Physics Division",
      custom_fields: {
        vendor: "K&S Associates, Inc.",
        vendor_address: "1926 Elm Tree Drive, Nashville, TN 37210-3718",
        vendor_phone: "(615) 883-9760",
        notes: "The chamber has been calibrated and will be used for annual calibration to replace the NE2571 SN2415",
      },
    },
    {
      name: "PTW TN30013 Farmer Chamber (New)",
      description: "(Annual) PTW TN30013, SN #04216 (New) waterproof Farmer",
      serial_number: "SN#04216",
      manufacturer: "PTW",
      model: "TN30013",
      equipment_type_id: ionChamberType[0].id,
      calibration_status_id: dueSoonStatus[0].id,
      last_calibration_date: "2023-06-05",
      next_calibration_date: "2025-06-05",
      assigned_person: "Jun Li",
      calibration_frequency_months: 24,
      location: "Medical Physics Division",
      custom_fields: {
        vendor: "K&S Associates, Inc.",
        vendor_address: "1926 Elm Tree Drive, Nashville, TN 37210-3718",
        vendor_phone: "(615) 883-9760",
        notes: "Purchased in 9/2009 and initially calibrated on 9/21/2009",
      },
    },
    {
      name: "PTW TN30010 SARRP Chamber",
      description: "PTW, Model# TN30010, SN #0444",
      serial_number: "SN#0444",
      manufacturer: "PTW",
      model: "TN30010",
      equipment_type_id: ionChamberType[0].id,
      calibration_status_id: overdueStatus[0].id,
      last_calibration_date: "2023-10-31",
      next_calibration_date: "2025-10-31",
      assigned_person: "Andrew Gerry (resident)",
      calibration_frequency_months: 24,
      location: "SARRP Facility",
      custom_fields: {
        vendor: "K&S Associates, Inc.",
        notes: "Calibrated for SARRP experiment, depends on need",
      },
    },
    {
      name: "Standard Imaging HDR Well Chamber",
      description: "(Brachy) Standard Imaging Well Chamber Model #HDR-1000 Plus, SN #A133388",
      serial_number: "SN#A133388",
      manufacturer: "Standard Imaging",
      model: "HDR-1000 Plus",
      equipment_type_id: wellChamberType[0].id,
      calibration_status_id: calibratedStatus[0].id,
      last_calibration_date: "2024-11-12",
      next_calibration_date: "2026-11-12",
      assigned_person: "Medical Physics Staff",
      calibration_frequency_months: 24,
      location: "Brachytherapy Suite",
      custom_fields: {
        vendor: "UW Radiation Calibration Lab.",
        vendor_address: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
      },
    },
    {
      name: "PTW Unidos Romeo MRL",
      description: "(MRL) PTW Unidos Romeo Type TN10053, SN#180343",
      serial_number: "SN#180343",
      manufacturer: "PTW",
      model: "TN10053",
      equipment_type_id: electrometerType[0].id,
      calibration_status_id: dueSoonStatus[0].id,
      last_calibration_date: "2022-12-07",
      next_calibration_date: "2025-04-10",
      assigned_person: "Jun Li (Karen Mooney)",
      calibration_frequency_months: 30,
      location: "MRL Suite",
      custom_fields: {
        vendor: "MD Anderson ADCL",
        notes: "DT sending out 8/5/25, calibrated both charge and current",
      },
    },
    {
      name: "PTW Unidos-E T10010 (New)",
      description: "(New) PTW Unidos-E, T10010, SN#002110",
      serial_number: "SN#002110",
      manufacturer: "PTW",
      model: "T10010",
      equipment_type_id: electrometerType[0].id,
      calibration_status_id: calibratedStatus[0].id,
      last_calibration_date: "2024-04-01",
      next_calibration_date: "2026-04-12",
      assigned_person: "Jun Li",
      calibration_frequency_months: 24,
      location: "Medical Physics Division",
      custom_fields: {
        vendor: "UW Radiation Calibration Lab.",
        vendor_address: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
        notes: "Purchased in Feb, 2016. To add current calib next time?",
      },
    },
    {
      name: "PTW Unidos T10010 (Riddle)",
      description: "PTW Unidos, T10010, SN00365 (Previously Riddle's)",
      serial_number: "SN00365",
      manufacturer: "PTW",
      model: "T10010",
      equipment_type_id: electrometerType[0].id,
      calibration_status_id: dueSoonStatus[0].id,
      last_calibration_date: "2023-09-01",
      next_calibration_date: "2025-09-11",
      assigned_person: "Jun Li",
      calibration_frequency_months: 24,
      location: "Medical Physics Division",
      custom_fields: {
        vendor: "K&S Associates, Inc.",
        vendor_address: "1926 Elm Tree Drive, Nashville, TN 37210-3718",
        vendor_phone: "(615) 883-9760",
        notes: "Sending out 08/01/2025, will wait until 2110 come back, calibrated both charge and current",
      },
    },
    {
      name: "PTW Unidos-E T10010 (Old Riddle)",
      description: "(Old Riddle - newly calibrated MRL) PTW Unidos-E, T10010, SN#00027",
      serial_number: "SN#00027",
      manufacturer: "PTW",
      model: "T10010",
      equipment_type_id: electrometerType[0].id,
      calibration_status_id: calibratedStatus[0].id,
      last_calibration_date: "2025-06-04",
      next_calibration_date: "2027-05-01",
      assigned_person: "D. Thomas",
      calibration_frequency_months: 24,
      location: "Medical Physics Division",
      custom_fields: {
        vendor: "K&S Associates, Inc.",
        notes: "Calibrated both charge and current",
      },
    },
  ]

  // Insert equipment
  for (const equipment of equipmentData) {
    await sql`
      INSERT INTO equipment (
        name, description, serial_number, manufacturer, model, 
        equipment_type_id, calibration_status_id, last_calibration_date, 
        next_calibration_date, assigned_person, calibration_frequency_months, 
        location, custom_fields, created_at, updated_at
      ) VALUES (
        ${equipment.name}, ${equipment.description}, ${equipment.serial_number},
        ${equipment.manufacturer}, ${equipment.model}, ${equipment.equipment_type_id},
        ${equipment.calibration_status_id}, ${equipment.last_calibration_date},
        ${equipment.next_calibration_date}, ${equipment.assigned_person},
        ${equipment.calibration_frequency_months}, ${equipment.location},
        ${JSON.stringify(equipment.custom_fields)}, NOW(), NOW()
      )
      ON CONFLICT (serial_number) DO NOTHING
    `
  }

  // Seed email settings
  await sql`
    INSERT INTO email_settings (setting_name, setting_value, description) VALUES
    ('weekly_report_enabled', 'true', 'Enable weekly calibration reports'),
    ('report_day', 'monday', 'Day of week to send reports'),
    ('report_recipients', 'jun.li@jefferson.edu,medical.physics@jefferson.edu', 'Email recipients for reports'),
    ('reminder_days_before', '30,7', 'Days before due date to send reminders')
    ON CONFLICT (setting_name) DO NOTHING
  `

  console.log("Database seeding completed!")
}

seedDatabase().catch(console.error)
