import { Injectable } from '@nestjs/common';
import { IInputReader } from '../../../domain/ports/input-reader.port';

@Injectable()
export class StringReaderAdapter implements IInputReader {
  constructor(private readonly input: string) {}

  async readLines(): Promise<string[]> {
    return Promise.resolve(
      this.input
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    );
  }

  async readLine(): Promise<string> {
    const lines = await this.readLines();
    return lines[0] || '';
  }
}
