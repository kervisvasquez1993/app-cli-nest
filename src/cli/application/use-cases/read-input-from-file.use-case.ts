// src/cli/application/use-cases/read-input-from-file.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { FILE_SYSTEM, IFileSystem } from '../../domain/ports/file-system.port';
import {
  OUTPUT_WRITER,
  IOutputWriter,
} from '../../domain/ports/output-writer.port';
import { ProcessOperationsBatchUseCase } from './process-operations-batch.use-case';
import { CLIError, EmptyFileError } from '../../domain/errors/cli.errors';
import { toInputLines } from '../../utils/input-lines.factory';
import { FilePath } from '../../domain/value-objects/file-path.vo';

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
      const normalizedPath = FilePath.from(filePath);

      const fileContent = await this.fileSystem.readFile(
        normalizedPath.getValue(),
        'utf-8',
      );

      if (!fileContent.trim()) {
        throw new EmptyFileError(normalizedPath.toString());
      }

      const rawLines = fileContent.split('\n');
      const inputLines = toInputLines(rawLines);

      if (inputLines.length === 0) {
        throw new EmptyFileError(normalizedPath.toString());
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
