import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import { OperationDto } from '../../capital-gains/dto/operation.dto';
import * as readline from 'readline';

export class InteractiveCommand {
  constructor(private readonly service: CapitalGainsService) {}

  execute(): void {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║      📊 Calculadora de Impuestos - Modo Interactivo      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    this.showExamples();
    console.log('─────────────────────────────────────────────────────────────');
    console.log('📝 Ingresa tus operaciones (línea vacía para terminar):');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const processLine = () => {
      rl.question('> ', (line: string) => {
        if (line.trim() === '') {
          console.log('\n✅ Sesión terminada. ¡Hasta pronto!');
          rl.close();
          process.exit(0);
          return;
        }

        try {
          const operations: OperationDto[] = JSON.parse(line);
          const results = this.service.processOperations(operations);
          console.log(`📤 Resultado: ${JSON.stringify(results)}\n`);
        } catch (error) {
          console.error(`❌ Error: ${error.message}\n`);
        }

        processLine();
      });
    };

    processLine();
  }

  private showExamples(): void {
    console.log('💡 Ejemplos de entrada:');
    console.log('');
    console.log('Compra simple:');
    console.log('  [{"operation":"buy", "unit-cost":10.00, "quantity": 100}]');
    console.log('');
    console.log('Compra y venta:');
    console.log('  [{"operation":"buy", "unit-cost":10.00, "quantity": 10000},');
    console.log('   {"operation":"sell", "unit-cost":20.00, "quantity": 5000}]');
    console.log('');
  }
}