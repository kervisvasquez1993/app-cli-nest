import { Injectable, Inject } from '@nestjs/common';
import {
  IOutputWriter,
  OUTPUT_WRITER,
} from '../../domain/ports/output-writer.port';
import { ProcessOperationsBatchUseCase } from './process-operations-batch.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';
import * as fs from 'fs/promises';

@Injectable()
export class ReadInputFromFileUseCase {
  constructor(
    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,
    private readonly processBatch: ProcessOperationsBatchUseCase,
  ) {}

  async execute(filePath: string): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const rawLines = fileContent.split('\n');

      const inputLines = rawLines
        .filter((line) => line.trim())
        .map((line) => InputLine.from(line));

      const outputLines = await this.processBatch.execute(inputLines);

      const outputStrings = outputLines.map((line) => line.toJSONString());
      await this.outputWriter.writeLines(outputStrings);
    } catch (error) {
      await this.outputWriter.writeError(
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }
}
