import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import * as readline from 'readline';

export class InteractiveCommand {
  constructor(private readonly service: CapitalGainsService) {}

  execute(): void {
    console.clear();
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log('║      📊 Calculadora de Impuestos - Modo Interactivo      ║');
    console.log(
      '╚════════════════════════════════════════════════════════════╝',
    );
    console.log('');
    this.showExamples();
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('📝 Ingresa tus operaciones (línea vacía para terminar):');
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const processLine = (): void => {
      rl.question('> ', (line: string) => {
        // ✅ Usar void para manejar la Promise
        void this.handleInput(line, rl, processLine);
      });
    };

    processLine();
  }

  // ✅ Método async para manejar la entrada
  private async handleInput(
    line: string,
    rl: readline.Interface,
    processLine: () => void,
  ): Promise<void> {
    if (line.trim() === '') {
      console.log('\n✅ Sesión terminada. ¡Hasta pronto!');
      rl.close();
      process.exit(0);
      return;
    }

    try {
      // ✅ Parsear de forma segura
      const parsed: unknown = JSON.parse(line);

      if (!Array.isArray(parsed)) {
        throw new Error('El formato debe ser un array de operaciones');
      }

      // ✅ Usar el método async correcto
      const results =
        await this.service.processOperationsWithValidation(parsed);
      console.log(`📤 Resultado: ${JSON.stringify(results)}\n`);
    } catch (error) {
      // ✅ Manejo seguro de errores
      const errorMessage = this.getErrorMessage(error);
      console.error(`❌ Error: ${errorMessage}\n`);
    }

    processLine();
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

  private showExamples(): void {
    console.log('💡 Ejemplos de entrada:');
    console.log('');
    console.log('Compra simple:');
    console.log('  [{"operation":"buy", "unit-cost":10.00, "quantity": 100}]');
    console.log('');
    console.log('Compra y venta:');
    console.log(
      '  [{"operation":"buy", "unit-cost":10.00, "quantity": 10000},',
    );
    console.log(
      '   {"operation":"sell", "unit-cost":20.00, "quantity": 5000}]',
    );
    console.log('');
  }
}
