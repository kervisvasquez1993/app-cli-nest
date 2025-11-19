// src/cli/infrastructure/adapters/input/stdin-reader.adapter.ts
import { Injectable } from '@nestjs/common';
import { IInputReader } from '../../../domain/ports/input-reader.port';
import * as readline from 'readline';

@Injectable()
export class StdinReaderAdapter implements IInputReader {
  async readLines(): Promise<string[]> {
    return new Promise((resolve) => {
      const lines: string[] = [];
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      rl.on('line', (line) => {
        if (line.trim()) {
          lines.push(line);
        }
      });

      rl.on('close', () => {
        resolve(lines);
      });
    });
  }

  async readLine(): Promise<string> {
    const lines = await this.readLines();
    return lines[0] || '';
  }
}
