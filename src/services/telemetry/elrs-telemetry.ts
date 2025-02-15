// curr primary method of telemetry transmission: ELRS crossfire

// 1. ELRS transmitter on the drone-side (server), connected to the flight controller via UART
// 2. ELRS tranmsitter talks to the RC transmitter on the RadioMaster Pocket (ELRS one)
// 3. RadioMaster Pocket connects to the gnd station laptop via USB-C
// 4. the protocol logic here extracts the data from the USB-C serial (?) and then displays on the interface (the frontend
// will be in React, all frontend components will be stored and implemented in the src/components/ folder)

import { SerialPort, ReadlineParser } from 'serialport';

// Define the serial port (update port name based on system)
const ELRS_PORT = '/dev/ttyUSB0'; // Change this to match your system (e.g., COM3 on Windows, /dev/ttyUSB0 on Linux)

const port = new SerialPort({
  path: ELRS_PORT,
  baudRate: 115200, // Common baud rate for ELRS telemetry (change if needed)
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' })); // Read line by line

// Handle serial data
parser.on('data', (data: string) => {
  console.log(`ELRS Data Received: ${data}`);

  // TODO: Parse data properly
  const telemetry = parseELRSData(data);

  // TODO: Send parsed telemetry to WebSocket or frontend
});

// Function to parse incoming ELRS telemetry data
function parseELRSData(rawData: string) {
  try {
    // Example: Split incoming comma-separated values
    const values = rawData.split(',');
    return {
      altitude: parseFloat(values[0]) || 0,
      battery: parseFloat(values[1]) || 0,
      rssi: parseFloat(values[2]) || 0,
    };
  } catch (error) {
    console.error('Error parsing ELRS data:', error);
    return null;
  }
}

// Handle errors
port.on('error', (err) => {
  console.error('Error with ELRS Serial Connection:', err);
});
