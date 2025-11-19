import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import * as readline from 'readline';

export class CalculateCommand {
  constructor(private readonly service: CapitalGainsService) {}

  execute(): void {
    console.log('📝 Esperando entrada (stdin). Línea vacía para terminar.\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', (line: string) => {
      void this.processLine(line, rl);
    });

    rl.on('close', () => {
      console.log('\n✅ Procesamiento completado');
      process.exit(0);
    });
  }

  private async processLine(
    line: string,
    rl: readline.Interface,
  ): Promise<void> {
    if (line.trim() === '') {
      rl.close();
      return;
    }

    try {
      const parsed: unknown = JSON.parse(line);

      if (!Array.isArray(parsed)) {
        throw new Error('El formato debe ser un array de operaciones');
      }

      const results =
        await this.service.processOperationsWithValidation(parsed);

      console.log(JSON.stringify(results));
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): void {
    if (this.isValidationError(error)) {
      console.error('❌ Errores de validación:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    } else if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error('❌ Error desconocido');
    }
  }

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
}
