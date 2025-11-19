import { Injectable, Inject } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import {
  IInputReader,
  INPUT_READER,
} from '../../domain/ports/input-reader.interface';
import {
  IOutputWriter,
  OUTPUT_WRITER,
} from '../../domain/ports/output-writer.interface';

@Injectable()
export class ProcessFileUseCase {
  constructor(
    @Inject(INPUT_READER)
    private readonly inputReader: IInputReader,

    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,

    private readonly processOperations: ProcessOperationsUseCase,
  ) {}

  async execute(filePath: string): Promise<void> {
    this.outputWriter.write(`📂 Procesando archivo: ${filePath}\n`);

    try {
      const lines = await this.inputReader.readFile(filePath);

      for (const line of lines) {
        await this.processLine(line);
      }

      this.outputWriter.writeSuccess('Archivo procesado exitosamente');
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.outputWriter.writeError(`Error procesando archivo: ${errorMessage}`);
      process.exit(1);
    }
  }

  private async processLine(line: string): Promise<void> {
    try {
      const parsed: unknown = JSON.parse(line);

      if (!Array.isArray(parsed)) {
        throw new Error('El formato debe ser un array de operaciones');
      }

      const results = await this.processOperations.execute(parsed);
      this.outputWriter.write(JSON.stringify(results));
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.outputWriter.writeError(errorMessage);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Error desconocido';
  }
}
