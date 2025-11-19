import { Injectable, Inject } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import {
  INPUT_READER,
  IInputReader,
} from '../../domain/ports/input-reader.interface';
import {
  OUTPUT_WRITER,
  IOutputWriter,
} from '../../domain/ports/output-writer.interface';

@Injectable()
export class ProcessStdinUseCase {
  constructor(
    @Inject(INPUT_READER)
    private readonly inputReader: IInputReader,

    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,

    private readonly processOperations: ProcessOperationsUseCase,
  ) {}

  async execute(): Promise<void> {
    this.outputWriter.write(
      '📝 Esperando entrada (stdin). Línea vacía para terminar.\n',
    );

    try {
      while (true) {
        const line = await this.inputReader.readLine();

        if (line.trim() === '') {
          break;
        }

        await this.processLine(line);
      }

      this.outputWriter.writeSuccess('Procesamiento completado');
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.outputWriter.writeError(errorMessage);
    } finally {
      this.inputReader.close();
    }
  }

  private async processLine(line: string): Promise<void> {
    try {
      // ✅ Parseamos y validamos
      const parsed: unknown = JSON.parse(line);

      if (!Array.isArray(parsed)) {
        throw new Error('El formato debe ser un array de operaciones');
      }

      const results = await this.processOperations.execute(parsed);
      this.outputWriter.write(JSON.stringify(results));
    } catch (error) {
      // ✅ Manejamos errores de validación
      if (this.isValidationError(error)) {
        this.outputWriter.writeError('Errores de validación:');
        this.outputWriter.write(JSON.stringify(error.response.errors, null, 2));
      } else {
        const errorMessage = this.getErrorMessage(error);
        this.outputWriter.writeError(errorMessage);
      }
    }
  }

  // ✅ Type guard para errores de validación
  private isValidationError(
    error: unknown,
  ): error is { response: { errors: unknown } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'errors' in error.response
    );
  }

  // ✅ Helper para extraer mensajes de error
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
