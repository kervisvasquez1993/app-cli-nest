// src/cli/application/use-cases/run-tests.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import {
  OUTPUT_WRITER,
  IOutputWriter,
} from '../../domain/ports/output-writer.interface';

interface TestCase {
  name: string;
  input: string;
  expected: string;
}

@Injectable()
export class RunTestsUseCase {
  constructor(
    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,

    private readonly processOperations: ProcessOperationsUseCase,
  ) {}

  async execute(): Promise<void> {
    this.outputWriter.write('🧪 Ejecutando casos de prueba\n');
    this.outputWriter.write(
      '═══════════════════════════════════════════════════════════\n',
    );

    const testCases = this.getTestCases();
    let passed = 0;
    let failed = 0;

    for (const [index, testCase] of testCases.entries()) {
      const result = await this.runTest(testCase, index + 1);
      if (result) {
        passed++;
      } else {
        failed++;
      }
    }
    this.outputWriter.write(
      '═══════════════════════════════════════════════════════════',
    );
    this.outputWriter.write(
      `📊 Resumen: ${passed} pasaron, ${failed} fallaron`,
    );
    this.outputWriter.write(
      '═══════════════════════════════════════════════════════════\n',
    );

    process.exit(failed > 0 ? 1 : 0);
  }

  private async runTest(testCase: TestCase, index: number): Promise<boolean> {
    try {
      // ✅ Parseamos de forma segura
      const parsed: unknown = JSON.parse(testCase.input);

      if (!Array.isArray(parsed)) {
        throw new Error('Test case inválido: debe ser un array');
      }

      const results = await this.processOperations.execute(parsed);
      const result = JSON.stringify(results);
      const isPass = result === testCase.expected;

      this.outputWriter.write(`${index}. ${testCase.name}`);
      this.outputWriter.write(`   Esperado: ${testCase.expected}`);
      this.outputWriter.write(`   Obtenido: ${result}`);
      this.outputWriter.write(`   ${isPass ? '✅ PASÓ' : '❌ FALLÓ'}\n`);

      return isPass;
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.outputWriter.writeError(`Error en test ${index}: ${errorMessage}`);
      return false;
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
