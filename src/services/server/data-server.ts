// RASPBERRY SERVER-SIDE WEBSOCKET SERVICE FOR TELEMETRY TRANSFER

// naive implementation

import WebSocket, { WebSocketServer } from 'ws';
import { SerialPort, ReadlineParser } from 'serialport';

const UART_PORT = '/dev/ttyS0'; // Adjust based on your FC UART setup
const BAUD_RATE = 115200;
const WS_PORT = 9090; // WebSocket server port

// Initialize WebSocket server
const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on('connection', (ws) => {
  console.log('Client connected to Raspberry Pi WebSocket telemetry stream.');

  // Handle incoming messages from the Ground Station
  ws.on('message', (message) => {
    console.log(`Received from client: ${message}`);

    // If ground station requests a stop, halt telemetry streaming
    if (message.toString() === 'STOP_TELEMETRY') {
      console.log('Halting telemetry stream upon ground station request.');
      ws.close();
    }
  });

  // Stream telemetry data from UART to WebSocket
  const serial = new SerialPort({ path: UART_PORT, baudRate: BAUD_RATE });
  const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', (data: string) => {
    const telemetry = parseTelemetryData(data);
    if (telemetry) ws.send(JSON.stringify(telemetry));
  });

  ws.on('close', () => console.log('Client disconnected from WebSocket.'));
});

// Parse telemetry data (custom format depends on FC output)
function parseTelemetryData(rawData: string) {
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
    console.error('Error parsing telemetry data:', error);
    return null;
  }
}

console.log(`WebSocket Telemetry Server running on ws://localhost:${WS_PORT}`);
