import { Injectable } from '@nestjs/common';
import { IOutputWriter } from '../../../domain/ports/output-writer.port';

@Injectable()
export class MemoryWriterAdapter implements IOutputWriter {
  private lines: string[] = [];
  private errors: string[] = [];

  writeLine(content: string): Promise<void> {
    this.lines.push(content);
    return Promise.resolve();
  }

  writeLines(contents: string[]): Promise<void> {
    this.lines.push(...contents);
    return Promise.resolve();
  }

  writeError(message: string): Promise<void> {
    this.errors.push(message);
    return Promise.resolve();
  }

  getLines(): string[] {
    return [...this.lines];
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  clear(): void {
    this.lines = [];
    this.errors = [];
  }

  getLastLine(): string | undefined {
    return this.lines[this.lines.length - 1];
  }

  getAllOutput(): string {
    return this.lines.join('\n');
  }
}
