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

    rl.on('line', async (line: string) => {
      if (line.trim() === '') {
        rl.close();
        return;
      }

      try {
        const operations = JSON.parse(line);

        // 🆕 Usar el método con validación
        const results =
          await this.service.processOperationsWithValidation(operations);

        console.log(JSON.stringify(results));
      } catch (error) {
        // 🆕 Mejor manejo de errores
        if (error.response?.errors) {
          console.error('❌ Errores de validación:');
          console.error(JSON.stringify(error.response.errors, null, 2));
        } else {
          console.error(`❌ Error: ${error.message}`);
        }
      }
    });

    rl.on('close', () => {
      console.log('\n✅ Procesamiento completado');
      process.exit(0);
    });
  }
}
