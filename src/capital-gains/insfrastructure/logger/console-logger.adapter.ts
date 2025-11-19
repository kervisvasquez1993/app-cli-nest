import { Injectable } from '@nestjs/common';
import { ILogger } from '../../domain/ports/logger.port';

@Injectable()
export class ConsoleLoggerAdapter implements ILogger {
  debug(message: string, context?: Record<string, any>): void {
    console.log(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '');
  }

  info(message: string, context?: Record<string, any>): void {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
  }

  warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    console.error(
      `[ERROR] ${message}`,
      error?.stack,
      context ? JSON.stringify(context) : '',
    );
  }
}
