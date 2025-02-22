// curr backup method of telemetry transmission: websocket json packets (non-video, video is not counted as "telemetry" in this project)

// 1. raspberry is connected to the flight controller, and raspberry extracts all the telemetry data that are being fed (in real time)
// by the UART peripherals connected to the FC
// 2. the server (raspberry pi) transmits the websocket json data packets to the client (gnd station, here)
// 3. the gnd station can reject these incoming data (and or tell the rasp pi to not send these), when the primary method is active
// 4. the logic here in websocket-tcp.ts, would be used to streamline this incoming data to be displayed in the frontend (again,
// src/components frontend ui components)

// ground station side client logic

import WebSocket from 'ws';

const WS_SERVER_URL = 'ws://192.168.1.100:9090'; // Change IP based on Raspberry Pi's network address

let ws: WebSocket | null = null;
let usePrimaryMethod = true; // If true, WebSocket telemetry is ignored

function connectWebSocket() {
  ws = new WebSocket(WS_SERVER_URL);

  ws.on('open', () => {
    console.log(`Connected to telemetry WebSocket server at ${WS_SERVER_URL}`);
  });

  ws.on('message', (message) => {
    if (!usePrimaryMethod) {
      const telemetry = JSON.parse(message.toString());
      console.log('Received WebSocket Telemetry:', telemetry);

      // TODO: Send data to frontend WebSocket or UI components
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed. Retrying...');
    setTimeout(connectWebSocket, 5000); // Attempt reconnection
  });

  ws.on('error', (err) => console.error('WebSocket error:', err));
}

// Function to enable or disable WebSocket telemetry
function toggleTelemetry(usePrimary: boolean) {
  usePrimaryMethod = usePrimary;
  if (usePrimaryMethod && ws) {
    console.log('Primary method active, stopping WebSocket telemetry.');
    ws.send('STOP_TELEMETRY');
  }
}

// Start WebSocket connection
connectWebSocket();
