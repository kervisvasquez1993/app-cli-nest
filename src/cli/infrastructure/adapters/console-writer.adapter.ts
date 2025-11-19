import { Injectable } from '@nestjs/common';
import { IOutputWriter } from '../../domain/ports/output-writer.interface';

@Injectable()
export class ConsoleWriterAdapter implements IOutputWriter {
  write(message: string): void {
    console.log(message);
  }

  writeError(message: string): void {
    console.error(`❌ ${message}`);
  }

  writeSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  clear(): void {
    console.clear();
  }
}
