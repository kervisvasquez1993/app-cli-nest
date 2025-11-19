import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import * as fs from 'fs';

export class FileCommand {
  constructor(private readonly service: CapitalGainsService) {}

  execute(filePath: string): void {
    console.log(`📂 Procesando archivo: ${filePath}\n`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Archivo no encontrado: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    this.processLines(lines);
  }
  private async processLines(lines: string[]): Promise<void> {
    for (const line of lines) {
      await this.processLine(line);
    }

    console.log('\n✅ Archivo procesado exitosamente');
    process.exit(0);
  }
  private async processLine(line: string): Promise<void> {
    try {
      const parsed: unknown = JSON.parse(line);

      if (!Array.isArray(parsed)) {
        throw new Error('El formato debe ser un array de operaciones');
      }
      const results =
        await this.service.processOperationsWithValidation(parsed);
      console.log(JSON.stringify(results));
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error(`❌ Error: ${errorMessage}`);
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
