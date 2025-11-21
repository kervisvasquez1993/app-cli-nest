import { Injectable, Inject } from '@nestjs/common';
import { FILE_SYSTEM, IFileSystem } from '../../domain/ports/file-system.port';
import {
  OUTPUT_WRITER,
  IOutputWriter,
} from '../../domain/ports/output-writer.port';
import { ProcessOperationsBatchUseCase } from './process-operations-batch.use-case';
import { CLIError, EmptyFileError } from '../../domain/errors/cli.errors';
import { toInputLines } from '../../utils/input-lines.factory';
@Injectable()
export class ReadInputFromFileUseCase {
  constructor(
    @Inject(FILE_SYSTEM)
    private readonly fileSystem: IFileSystem,

    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,

    private readonly processBatch: ProcessOperationsBatchUseCase,
  ) {}

  async execute(filePath: string): Promise<void> {
    try {
      const fileContent = await this.fileSystem.readFile(filePath, 'utf-8');

      if (!fileContent.trim()) {
        throw new EmptyFileError(filePath);
      }

      const rawLines = fileContent.split('\n');
      const inputLines = toInputLines(rawLines);

      if (inputLines.length === 0) {
        throw new EmptyFileError(filePath);
      }

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
