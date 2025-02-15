// curr backup method of telemetry transmission: websocket json packets (non-video, video is not counted as "telemetry" in this project)

// 1. raspberry is connected to the flight controller, and raspberry extracts all the telemetry data that are being fed (in real time)
// by the UART peripherals connected to the FC
// 2. the server (raspberry pi) transmits the websocket json data packets to the client (gnd station, here)
// 3. the gnd station can reject these incoming data (and or tell the rasp pi to not send these), when the primary method is active
// 4. the logic here in ws-protocol.ts, would be used to streamline this incoming data to be displayed in the frontend (again,
// src/components frontend ui components)
