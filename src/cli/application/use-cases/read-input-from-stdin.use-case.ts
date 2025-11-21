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

import { CLIError } from '../../domain/errors/cli.errors';
import { toInputLines } from '../../utils/input-lines.factory';

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
      const inputLines = toInputLines(rawLines);

      const outputLines = await this.processBatch.execute(inputLines);
      const outputStrings = outputLines.map((line) => line.toJSONString());

      await this.outputWriter.writeLines(outputStrings);
    } catch (error) {
      if (error instanceof CLIError) {
        await this.outputWriter.writeError(`[${error.code}] ${error.message}`);
      } else {
        await this.outputWriter.writeError(
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
      throw error;
    }
  }
}
