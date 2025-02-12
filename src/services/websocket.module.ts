import { Module, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';

@Module({})
export class WebSocketModule implements OnModuleInit {
  public wss: WebSocket.Server;

  onModuleInit() {
    this.wss = new WebSocket.Server({ port: 8080 });
    console.log('WebSocket server started on port 8080');
  }
}
