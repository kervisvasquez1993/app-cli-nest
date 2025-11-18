import { CapitalGainsController } from '../../capital-gains/capital-gains.controller';
import * as readline from 'readline';

export class CalculateCommand {
  constructor(private readonly controller: CapitalGainsController) {}

  execute(): void {
    console.log('📝 Esperando entrada (stdin). Línea vacía para terminar.\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', (line: string) => {
      if (line.trim() === '') {
        rl.close();
        return;
      }

      try {
        const result = this.controller.processLine(line);
        console.log(result);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
    });

    rl.on('close', () => {
      console.log('\n✅ Procesamiento completado');
      process.exit(0);
    });
  }
}
