import { Injectable } from '@nestjs/common';
import * as readline from 'readline';
import * as fs from 'fs';
import { IInputReader } from '../../domain/ports/input-reader.interface';

@Injectable()
export class StdinReaderAdapter implements IInputReader {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
  }

  async readLine(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.once('line', (line: string) => {
        resolve(line);
      });
    });
  }

  readFile(path: string): Promise<string[]> {
    const content = fs.readFileSync(path, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    return Promise.resolve(lines);
  }

  close(): void {
    this.rl.close();
  }
}
