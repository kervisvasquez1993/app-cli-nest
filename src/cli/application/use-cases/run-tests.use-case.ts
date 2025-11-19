import { Injectable, Inject } from '@nestjs/common';
import {
  IOutputWriter,
  OUTPUT_WRITER,
} from '../../domain/ports/output-writer.port';
import { ProcessOperationsBatchUseCase } from './process-operations-batch.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';

interface TestCase {
  name: string;
  input: string[];
  expectedOutput: string[];
}

@Injectable()
export class RunTestsUseCase {
  constructor(
    @Inject(OUTPUT_WRITER)
    private readonly outputWriter: IOutputWriter,
    private readonly processBatch: ProcessOperationsBatchUseCase,
  ) {}

  async execute(): Promise<void> {
    const testCases = this.getTestCases();
    let passed = 0;
    let failed = 0;

    await this.outputWriter.writeLine('\n🧪 Executando casos de teste...\n');

    for (const testCase of testCases) {
      try {
        const inputLines = testCase.input.map((line) => InputLine.from(line));
        const outputLines = await this.processBatch.execute(inputLines);
        const actualOutput = outputLines.map((line) => line.toJSONString());

        const success = this.compareOutputs(
          actualOutput,
          testCase.expectedOutput,
        );

        if (success) {
          passed++;
          await this.outputWriter.writeLine(`✅ ${testCase.name} - PASSOU`);
        } else {
          failed++;
          await this.outputWriter.writeLine(`❌ ${testCase.name} - FALHOU`);
          await this.outputWriter.writeLine(
            `   Esperado: ${testCase.expectedOutput.join(' ')}`,
          );
          await this.outputWriter.writeLine(
            `   Recebido: ${actualOutput.join(' ')}`,
          );
        }
      } catch (error) {
        failed++;
        await this.outputWriter.writeError(
          `❌ ${testCase.name} - ERRO: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    await this.outputWriter.writeLine(
      `\n📊 Resultados: ${passed} passou, ${failed} falhou\n`,
    );

    if (failed > 0) {
      throw new Error(`${failed} test(s) failed`);
    }
  }

  private compareOutputs(actual: string[], expected: string[]): boolean {
    if (actual.length !== expected.length) return false;

    return actual.every((line, index) => {
      const actualParsed = JSON.parse(line);
      const expectedParsed = JSON.parse(expected[index]);
      return JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
    });
  }

  private getTestCases(): TestCase[] {
    return [
      {
        name: 'Caso #1 - Operações abaixo do limite',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 100},{"operation":"sell", "unit-cost":15.00, "quantity": 50},{"operation":"sell", "unit-cost":15.00, "quantity": 50}]',
        ],
        expectedOutput: ['[{"tax":0},{"tax":0},{"tax":0}]'],
      },
      {
        name: 'Caso #2 - Lucro com imposto e prejuízo',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":20.00, "quantity": 5000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]',
        ],
        expectedOutput: ['[{"tax":0},{"tax":10000},{"tax":0}]'],
      },
      {
        name: 'Caso #3 - Dedução de prejuízo',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000},{"operation":"sell", "unit-cost":20.00, "quantity": 3000}]',
        ],
        expectedOutput: ['[{"tax":0},{"tax":0},{"tax":1000}]'],
      },
      {
        name: 'Caso #4 - Média ponderada sem lucro',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"buy", "unit-cost":25.00, "quantity": 5000},{"operation":"sell", "unit-cost":15.00, "quantity": 10000}]',
        ],
        expectedOutput: ['[{"tax":0},{"tax":0},{"tax":0}]'],
      },
      {
        name: 'Caso #5 - Média ponderada com lucro',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"buy", "unit-cost":25.00, "quantity": 5000},{"operation":"sell", "unit-cost":15.00, "quantity": 10000},{"operation":"sell", "unit-cost":25.00, "quantity": 5000}]',
        ],
        expectedOutput: ['[{"tax":0},{"tax":0},{"tax":0},{"tax":10000}]'],
      },
      {
        name: 'Caso #6 - Múltiplas deduções de prejuízo',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":2.00, "quantity": 5000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":25.00, "quantity": 1000}]',
        ],
        expectedOutput: [
          '[{"tax":0},{"tax":0},{"tax":0},{"tax":0},{"tax":3000}]',
        ],
      },
      {
        name: 'Caso #1 + Caso #2 - Linhas independentes',
        input: [
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 100},{"operation":"sell", "unit-cost":15.00, "quantity": 50},{"operation":"sell", "unit-cost":15.00, "quantity": 50}]',
          '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":20.00, "quantity": 5000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]',
        ],
        expectedOutput: [
          '[{"tax":0},{"tax":0},{"tax":0}]',
          '[{"tax":0},{"tax":10000},{"tax":0}]',
        ],
      },
    ];
  }
}
