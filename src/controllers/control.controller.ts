import { Controller, Get, Post, Body } from '@nestjs/common';

interface ControlStatus {
  isConnected: boolean;
  lastCommand: string | null;
  lastCommandTime: number | null;
  status: 'ready' | 'busy' | 'error';
  error: string | null;
}

interface CommandData {
  command: string;
  params?: Record<string, unknown>;
}

interface CommandResponse {
  status: string;
  message: string;
  timestamp: number;
}

@Controller('api/control')
export class ControlController {
  private controlStatus: ControlStatus = {
    isConnected: true,
    lastCommand: null,
    lastCommandTime: null,
    status: 'ready',
    error: null,
  };

  @Get('status')
  getControlStatus(): ControlStatus {
    return this.controlStatus;
  }

  @Post('command')
  sendCommand(@Body() commandData: CommandData): CommandResponse {
    const command = commandData.command;
    const params = commandData.params;

    // Process command (this would interact with drone in a real implementation)
    console.log(`Processing command: ${command}`, params);

    // Update control status
    this.controlStatus = {
      ...this.controlStatus,
      lastCommand: command,
      lastCommandTime: Date.now(),
      // In a real implementation, we'd check if the command was successful
      status: 'ready',
    };

    return {
      status: 'success',
      message: `Command ${command} processed successfully`,
      timestamp: Date.now(),
    };
  }
}
