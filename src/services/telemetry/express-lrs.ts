// curr primary method of telemetry transmission: ELRS crossfire

// 1. ELRS transmitter on the drone-side (server), connected to the flight controller via UART
// 2. ELRS tranmsitter talks to the RC transmitter on the RadioMaster Pocket (ELRS one)
// 3. RadioMaster Pocket connects to the gnd station laptop via USB-C
// 4. the protocol logic here extracts the data from the USB-C serial (?) and then displays on the interface (the frontend
// will be in React, all frontend components will be stored and implemented in the src/components/ folder)

import { SerialPort, ReadlineParser } from 'serialport';
import WebSocket from 'ws';

// Function to detect available serial ports and connect to ELRS receiver
async function connectELRS() {
  const ports = await SerialPort.list();
  console.log(
    'Available Serial Ports:',
    ports.map((p) => p.path),
  );

  const ELRS_PORT =
    ports.find((p) => p.path.includes('ttyUSB') || p.path.includes('COM'))
      ?.path || '/dev/ttyUSB0';

  const port = new SerialPort({
    path: ELRS_PORT,
    baudRate: 115200, // Standard baud rate for ELRS telemetry
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  // Handle received telemetry data
  parser.on('data', (data: string) => {
    console.log(`ELRS Data Received: ${data}`);
    const telemetry = parseELRSData(data);
    if (telemetry) broadcastTelemetry(telemetry);
  });

  // Handle serial connection errors
  port.on('error', (err) =>
    console.error('Error with ELRS Serial Connection:', err),
  );
}

// Function to parse incoming ELRS telemetry data
function parseELRSData(rawData: string) {
  try {
    const values = rawData.trim().split(',');

    return {
      altitude: values[0] ? parseFloat(values[0]) : null,
      battery: values[1] ? parseFloat(values[1]) : null,
      rssi: values[2] ? parseFloat(values[2]) : null,
      gps:
        values.length > 4
          ? { lat: parseFloat(values[3]), lon: parseFloat(values[4]) }
          : null,
      flightMode: values[5] || 'UNKNOWN',
    };
  } catch (error) {
    console.error('Error parsing ELRS telemetry:', error);
    return null;
  }
}

// Create a WebSocket server for real-time telemetry updates
const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
  console.log('New WebSocket Connection Established');
});

// Broadcast telemetry data to all connected WebSocket clients
function broadcastTelemetry(telemetry: object) {
  const message = JSON.stringify(telemetry);
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Initialize ELRS connection
connectELRS();

// Handle errors
// port.on('error', (err) => {
//   console.error('Error with ELRS Serial Connection:', err);
// });
