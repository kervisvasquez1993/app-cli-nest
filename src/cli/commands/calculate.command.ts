import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import { OperationDto } from '../../capital-gains/dto/operation.dto';
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
      if (line.trim() === '') {
        rl.close();
        return;
      }

      try {
        const operations: OperationDto[] = JSON.parse(line);
        const results = this.service.processOperations(operations);
        console.log(JSON.stringify(results));
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