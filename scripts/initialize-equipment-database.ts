import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function initializeEquipmentDatabase() {
  try {
    console.log("Starting equipment database initialization...")

    await sql`DELETE FROM equipment`
    console.log("Cleared existing equipment data")

    const ionChambers = [
      {
        serial_number: "SN#2118",
        description: "(Annual) PTW TN30013, SN#2118, 0.6 cm waterproof Farmer",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30013",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2023-11-15",
        next_calibration: "2025-11-27",
        calibration_interval: 24,
        vendor_name: "K&S Associates, Inc.",
        vendor_contact:
          "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760, Toll Free: (800) 522-2325",
        notes: "The chamber has been calibrated and will be used for annual calibration to replace the NE2571 SN2415",
      },
      {
        serial_number: "SN#04216",
        description: "(Annual) PTW TN30013, SN #04216 (New) waterproof Farmer",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30013",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2025-06-05",
        next_calibration: "2027-05-05",
        calibration_interval: 24,
        vendor_name: "K&S Associates, Inc.",
        vendor_contact:
          "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760, Toll Free: (800) 522-2325",
        notes: "Purchased in 9/2009 and initially calibrated on 9/21/2009",
      },
      {
        serial_number: "SN#0444",
        description: "PTW, Model# TN30010, SN #0444",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30010",
        location: "SARRP Lab",
        assigned_person: "Andrew Gerry (resident)",
        calibration_status: "Calibrated",
        last_calibration: "2023-10-31",
        next_calibration: "2025-10-31",
        calibration_interval: 24,
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "K&S Associates, Inc.",
        notes: "Calibrated for SARRP experiment, depends on need",
      },
      {
        serial_number: "SN#A133388",
        description: "(Brachy) Standard Imaging Well Chamber Model #HDR-1000 Plus, SN #A133388",
        equipment_type: "Well Chamber",
        manufacturer: "Standard Imaging",
        model: "HDR-1000 Plus",
        location: "Brachytherapy Suite",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2024-11-12",
        next_calibration: "2026-11-12",
        calibration_interval: 24,
        vendor_name: "UW Radiation Calibration Lab.",
        vendor_contact: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
        notes: "Brachytherapy well chamber for HDR treatments",
      },
    ]

    const electrometers = [
      {
        serial_number: "SN#180343",
        description: "(MRL) PTW Unidos Romeo Type TN10053, SN#180343",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos Romeo TN10053",
        location: "MRL Suite",
        assigned_person: "Jun Li (Karen Mooney)",
        calibration_status: "Due Soon",
        last_calibration: "2022-12-07",
        next_calibration: "2025-04-10",
        calibration_interval: 24,
        vendor_name: "MD Anderson ADCL",
        vendor_contact: "MD Anderson ADCL",
        notes: "DT sending out 8/5/25, calibrated both charge and current",
      },
      {
        serial_number: "SN#002110",
        description: "(New) PTW Unidos-E, T10010, SN#002110",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos-E T10010",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2024-04-01",
        next_calibration: "2026-04-12",
        calibration_interval: 24,
        vendor_name: "UW Radiation Calibration Lab.",
        vendor_contact: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
        notes: "Purchased in Feb, 2016. To add current calib next time?",
      },
      {
        serial_number: "SN00365",
        description: "PTW Unidos, T10010, SN00365",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos T10010",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Due Soon",
        last_calibration: "2023-09-01",
        next_calibration: "2025-09-11",
        calibration_interval: 24,
        vendor_name: "K&S Associates, Inc.",
        vendor_contact:
          "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760, Toll Free: (800) 522-2325",
        notes:
          "Previously Riddle's. Sending out 08/01/2025, will wait until 2110 come back. Calibrated both charge and current",
      },
      {
        serial_number: "SN#00027",
        description: "(Old Riddle - newly calibrated MRL) PTW Unidos-E, T10010, SN#00027",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos-E T10010",
        location: "MRL Suite",
        assigned_person: "D. Thomas",
        calibration_status: "Calibrated",
        last_calibration: "2025-06-04",
        next_calibration: "2027-05-01",
        calibration_interval: 24,
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "K&S Associates, Inc.",
        notes: "Calibrated both charge and current",
      },
    ]

    const allEquipment = [...ionChambers, ...electrometers]

    for (const equipment of allEquipment) {
      await sql`
        INSERT INTO equipment (
          serial_number, description, equipment_type, manufacturer, model,
          location, assigned_person, calibration_status, last_calibration,
          next_calibration, calibration_interval, vendor_name, vendor_contact, notes
        ) VALUES (
          ${equipment.serial_number}, ${equipment.description}, ${equipment.equipment_type},
          ${equipment.manufacturer}, ${equipment.model}, ${equipment.location},
          ${equipment.assigned_person}, ${equipment.calibration_status}, ${equipment.last_calibration},
          ${equipment.next_calibration}, ${equipment.calibration_interval}, ${equipment.vendor_name},
          ${equipment.vendor_contact}, ${equipment.notes}
        )
      `
    }

    console.log(`Successfully inserted ${allEquipment.length} equipment items`)
    console.log("Equipment database initialization completed!")

    const summary = await sql`
      SELECT equipment_type, calibration_status, COUNT(*) as count
      FROM equipment 
      GROUP BY equipment_type, calibration_status
      ORDER BY equipment_type, calibration_status
    `

    console.log("\nEquipment Summary:")
    summary.forEach((row) => {
      console.log(`${row.equipment_type} - ${row.calibration_status}: ${row.count}`)
    })
  } catch (error) {
    console.error("Error initializing equipment database:", error)
    throw error
  }
}

// Run the initialization
initializeEquipmentDatabase()
  .then(() => {
    console.log("Database initialization script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Database initialization failed:", error)
    process.exit(1)
  })
