// TODO: PLACEHOLDER FOR THE DATABASE CRUD LOGIC HANDLER, WILL BE PULLED FOR ALL THE COMPONENTS IF NECESSARY
import { Injectable } from '@nestjs/common';
import WebSocket from 'ws';
import { WebSocketModule } from 'src/services/websocket.module';

@Injectable()
export class BroadcastService {
  private clients: Set<WebSocket> = new Set();

  constructor(private readonly webSocketModule: WebSocketModule) {
    this.webSocketModule.wss.on('connection', (ws) => {
      console.log('Client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  public broadcast(
    data: Buffer | object | string,
    metadata?: object,
    binaryData?: Buffer
  ) {
    let messageBuffer: Buffer;
    let finalBuffer: Buffer;

    // Convert the main data and metadata to a message buffer
    if (data instanceof Buffer) {
      messageBuffer = data;
    } else {
      const message = {
        ...metadata,
        data,
        timestamp: Date.now(),
      };
      messageBuffer = Buffer.from(JSON.stringify(message));
    }

    // If there's additional binary data, concatenate it with a separator
    if (binaryData) {
      const separator = Buffer.from('\n');
      finalBuffer = Buffer.concat([messageBuffer, separator, binaryData]);
    } else {
      finalBuffer = messageBuffer;
    }

    // Broadcast to all connected clients
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(finalBuffer);
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
