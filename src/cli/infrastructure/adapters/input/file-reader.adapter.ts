import { Injectable } from '@nestjs/common';
import { IInputReader } from '../../../domain/ports/input-reader.port';
import * as fs from 'fs/promises';

@Injectable()
export class FileReaderAdapter implements IInputReader {
  constructor(private readonly filePath: string) {}

  async readLines(): Promise<string[]> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      return fileContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch (error) {
      throw new Error(
        `Failed to read file ${this.filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async readLine(): Promise<string> {
    const lines = await this.readLines();
    return lines[0] || '';
  }
}
