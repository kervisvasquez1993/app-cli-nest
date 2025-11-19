import { Injectable } from '@nestjs/common';
import { IOutputWriter } from '../../../domain/ports/output-writer.port';

@Injectable()
export class ConsoleWriterAdapter implements IOutputWriter {
  writeLine(content: string): Promise<void> {
    console.log(content);
    return Promise.resolve();
  }

  writeLines(contents: string[]): Promise<void> {
    contents.forEach((content) => console.log(content));
    return Promise.resolve();
  }

  writeError(message: string): Promise<void> {
    console.error(message);
    return Promise.resolve();
  }
}
