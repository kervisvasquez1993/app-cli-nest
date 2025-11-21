import { IOutputWriter } from '../../../domain/ports/output-writer.port';
import * as fs from 'fs/promises';

export class FileWriterAdapter implements IOutputWriter {
  constructor(private readonly filePath: string) {}

  async writeLine(content: string): Promise<void> {
    await fs.appendFile(this.filePath, content + '\n', 'utf-8');
  }

  async writeLines(contents: string[]): Promise<void> {
    const data = contents.join('\n') + '\n';
    await fs.appendFile(this.filePath, data, 'utf-8');
  }

  async writeError(message: string): Promise<void> {
    await fs.appendFile(this.filePath, `ERROR: ${message}\n`, 'utf-8');
  }
}
