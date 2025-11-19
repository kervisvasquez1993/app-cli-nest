import { Injectable, Inject } from '@nestjs/common';
import {
  IInputReader,
  INPUT_READER,
} from '../../domain/ports/input-reader.port';
import {
  IOutputWriter,
  OUTPUT_WRITER,
} from '../../domain/ports/output-writer.port';
import { ProcessOperationsBatchUseCase } from './process-operations-batch.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';

@Injectable()
export class ReadInputFromStdinUseCase {
  constructor(
    @Inject(INPUT_READER)
    private readonly inputReader: IInputReader,
    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,
    private readonly processBatch: ProcessOperationsBatchUseCase,
  ) {}

  async execute(): Promise<void> {
    try {
      const rawLines = await this.inputReader.readLines();
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
