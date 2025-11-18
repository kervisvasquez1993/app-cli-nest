import { CapitalGainsController } from '../../capital-gains/capital-gains.controller';

interface TestCase {
  name: string;
  input: string;
  expected: string;
}

export class TestCommand {
  constructor(private readonly controller: CapitalGainsController) {}

  execute(): void {
    console.log('🧪 Ejecutando casos de prueba\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const testCases = this.getTestCases();
    let passed = 0;
    let failed = 0;

    testCases.forEach((testCase, index) => {
      const result = this.controller.processLine(testCase.input);
      const isPass = result === testCase.expected;

      console.log(`${index + 1}. ${testCase.name}`);
      console.log(`   Esperado: ${testCase.expected}`);
      console.log(`   Obtenido: ${result}`);
      console.log(`   ${isPass ? '✅ PASÓ' : '❌ FALLÓ'}`);
      console.log('');

      if (isPass) passed++;
      else failed++;
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📊 Resumen: ${passed} pasaron, ${failed} fallaron`);
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
  }

  private getTestCases(): TestCase[] {
    return [
      {
        name: 'Caso #1: Operaciones < R$ 20,000',
        input:
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 100}, {"operation":"sell", "unit-cost":15.00, "quantity": 50}, {"operation":"sell", "unit-cost":15.00, "quantity": 50}]',
        expected: '[{"tax":0},{"tax":0},{"tax":0}]',
      },
      {
        name: 'Caso #2: Lucro y pérdida',
        input:
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, {"operation":"sell", "unit-cost":20.00, "quantity": 5000}, {"operation":"sell", "unit-cost":5.00, "quantity": 5000}]',
        expected: '[{"tax":0},{"tax":10000},{"tax":0}]',
      },
      {
        name: 'Caso #3: Deducción de pérdidas',
        input:
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, {"operation":"sell", "unit-cost":5.00, "quantity": 5000}, {"operation":"sell", "unit-cost":20.00, "quantity": 3000}]',
        expected: '[{"tax":0},{"tax":0},{"tax":1000}]',
      },
      {
        name: 'Caso #4: Múltiples compras con promedio ponderado',
        input:
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, {"operation":"buy", "unit-cost":25.00, "quantity": 5000}, {"operation":"sell", "unit-cost":15.00, "quantity": 10000}]',
        expected: '[{"tax":0},{"tax":0},{"tax":0}]',
      },
      {
        name: 'Caso #5: Venta después de promedio ponderado',
        input:
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, {"operation":"buy", "unit-cost":25.00, "quantity": 5000}, {"operation":"sell", "unit-cost":15.00, "quantity": 10000}, {"operation":"sell", "unit-cost":25.00, "quantity": 5000}]',
        expected: '[{"tax":0},{"tax":0},{"tax":0},{"tax":10000}]',
      },
    ];
  }
}