import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function initializeEquipmentDatabase() {
  console.log("Starting equipment database initialization...")

  try {
    // Clear existing equipment data
    await sql`DELETE FROM equipment`
    console.log("Cleared existing equipment data")

    // Insert Ion Chambers
    const ionChambers = [
      {
        serial_number: "SN#2118",
        description: "PTW TN30013, SN#2118, 0.6 cm waterproof Farmer",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30013",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2023-11-15",
        next_calibration: "2025-11-27",
        calibration_frequency: "Annual",
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760",
        notes: "The chamber has been calibrated and will be used for annual calibration to replace the NE2571 SN2415",
      },
      {
        serial_number: "SN#04216",
        description: "PTW TN30013, SN #04216 (New) waterproof Farmer",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30013",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2025-06-05",
        next_calibration: "2027-05-05",
        calibration_frequency: "Annual",
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760",
        notes: "Purchased in 9/2009 and initially calibrated on 9/21/2009",
      },
      {
        serial_number: "SN#0444",
        description: "PTW, Model# TN30010, SN #0444",
        equipment_type: "Ion Chamber",
        manufacturer: "PTW",
        model: "TN30010",
        location: "Research Lab",
        assigned_person: "Andrew Gerry (resident)",
        calibration_status: "Due Soon",
        last_calibration: "2023-10-31",
        next_calibration: "2025-10-31",
        calibration_frequency: "Biennial",
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "1926 Elm Tree Drive, Nashville, TN 37210-3718",
        notes: "Calibrated for SARRP experiment, depends on need",
      },
      {
        serial_number: "SN#A133388",
        description: "Standard Imaging Well Chamber Model #HDR-1000 Plus, SN #A133388",
        equipment_type: "Well Chamber",
        manufacturer: "Standard Imaging",
        model: "HDR-1000 Plus",
        location: "Brachytherapy Suite",
        assigned_person: "Medical Physics Staff",
        calibration_status: "Calibrated",
        last_calibration: "2026-11-12",
        next_calibration: "2026-11-12",
        calibration_frequency: "Annual",
        vendor_name: "UW Radiation Calibration Lab",
        vendor_contact: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
        notes: "Used for brachytherapy source calibration",
      },
    ]

    // Insert Electrometers
    const electrometers = [
      {
        serial_number: "SN#180343",
        description: "PTW Unidos Romeo Type TN10053, SN#180343",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos Romeo TN10053",
        location: "MRL Suite",
        assigned_person: "Jun Li (Karen Mooney)",
        calibration_status: "Due Soon",
        last_calibration: "2022-12-07",
        next_calibration: "2025-12-10",
        calibration_frequency: "Triennial",
        vendor_name: "MD Anderson ADCL",
        vendor_contact: "MD Anderson Cancer Center",
        notes: "DT sending out 8/5/25, calibrated both charge and current",
      },
      {
        serial_number: "SN#002110",
        description: "PTW Unidos-E, T10010, SN#002110",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos-E T10010",
        location: "Main Lab",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2024-04-01",
        next_calibration: "2026-04-12",
        calibration_frequency: "Biennial",
        vendor_name: "UW Radiation Calibration Lab",
        vendor_contact: "Room B1002, WIMR, 1111 Highland Avenue, Madison, WI 53705-2275",
        notes: "Purchased in Feb. 2016, to add current calib nex time?",
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
        calibration_frequency: "Biennial",
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760",
        notes:
          "Previously Riddle's, Sending out 08/01/2025 will wait until 2110 come back, calibrated both charge and current",
      },
      {
        serial_number: "SN#00027",
        description: "PTW Unidos-E, T10010, SN#00027",
        equipment_type: "Electrometer",
        manufacturer: "PTW",
        model: "Unidos-E T10010",
        location: "MRL Suite",
        assigned_person: "Jun Li",
        calibration_status: "Calibrated",
        last_calibration: "2025-06-04",
        next_calibration: "2027-05-01",
        calibration_frequency: "Biennial",
        vendor_name: "K&S Associates, Inc.",
        vendor_contact: "1926 Elm Tree Drive, Nashville, TN 37210-3718, Phone: (615) 883-9760",
        notes: "Old Riddle - newly calibrated MRL, PTW Unidos-E, T10010, SN#00027, calibrated both charge and current",
      },
    ]

    // Insert all equipment
    const allEquipment = [...ionChambers, ...electrometers]

    for (const equipment of allEquipment) {
      await sql`
        INSERT INTO equipment (
          serial_number, description, equipment_type, manufacturer, model,
          location, assigned_person, calibration_status, last_calibration,
          next_calibration, calibration_frequency, vendor_name, vendor_contact, notes
        ) VALUES (
          ${equipment.serial_number}, ${equipment.description}, ${equipment.equipment_type},
          ${equipment.manufacturer}, ${equipment.model}, ${equipment.location},
          ${equipment.assigned_person}, ${equipment.calibration_status}, ${equipment.last_calibration},
          ${equipment.next_calibration}, ${equipment.calibration_frequency}, ${equipment.vendor_name},
          ${equipment.vendor_contact}, ${equipment.notes}
        )
      `
    }

    console.log(`Successfully inserted ${allEquipment.length} equipment items`)
    console.log("Equipment database initialization completed!")

    // Verify the data
    const count = await sql`SELECT COUNT(*) as count FROM equipment`
    console.log(`Total equipment in database: ${count[0].count}`)
  } catch (error) {
    console.error("Error initializing equipment database:", error)
    throw error
  }
}

// Run the initialization
initializeEquipmentDatabase()
  .then(() => console.log("Database initialization successful"))
  .catch((error) => console.error("Database initialization failed:", error))
