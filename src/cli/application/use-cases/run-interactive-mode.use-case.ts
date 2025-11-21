// import { Injectable, Inject } from '@nestjs/common';
// import { InteractiveProcessorService } from '../services/interactive-processor.service';
// import {
//   IInteractiveUI,
//   INTERACTIVE_UI,
// } from '../../domain/ports/interactive-ui.port';
// import { OperationHistory } from '../services/operation-history.service';

// // interface OperationHistory {
// //   operation: 'buy' | 'sell';
// //   unitCost: number;
// //   quantity: number;
// //   tax: number;
// //   timestamp: Date;
// // }

// @Injectable()
// export class RunInteractiveModeUseCase {
//   private history: OperationHistory[] = [];

//   constructor(
//     private readonly interactiveProcessor: InteractiveProcessorService,
//     @Inject(INTERACTIVE_UI)
//     private readonly ui: IInteractiveUI,
//   ) {}

//   async execute(): Promise<void> {
//     this.ui.clear();
//     this.showWelcome();

//     let running = true;

//     while (running) {
//       const action = await this.ui.showMenu([
//         { name: '🛒 Registrar compra', value: 'buy' },
//         { name: '💸 Registrar venta', value: 'sell' },
//         { name: '📊 Ver portafolio actual', value: 'view' },
//         { name: '📜 Ver historial de operaciones', value: 'history' },
//         { name: '🔄 Resetear portafolio', value: 'reset' },
//         { name: '💾 Exportar resultados', value: 'export' },
//         { name: '❌ Salir', value: 'exit' },
//       ]);

//       try {
//         switch (action) {
//           case 'buy':
//             await this.handleBuy();
//             break;
//           case 'sell':
//             await this.handleSell();
//             break;
//           case 'view':
//             await this.handleView();
//             break;
//           case 'history':
//             await this.handleHistory();
//             break;
//           case 'reset':
//             await this.handleReset();
//             break;
//           case 'export':
//             await this.handleExport();
//             break;
//           case 'exit':
//             running = false;
//             this.showGoodbye();
//             break;
//         }
//       } catch (error) {
//         this.ui.clear();
//         this.ui.showMessage(
//           `\n⚠️  Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
//           'error',
//         );
//         await this.ui.pause();
//       }
//     }
//   }

//   private showWelcome(): void {
//     console.log('\n');
//     console.log(
//       '╔════════════════════════════════════════════════════════════╗',
//     );
//     console.log(
//       '║        🏦 Capital Gains Calculator - Interactive Mode      ║',
//     );
//     console.log(
//       '║                                                            ║',
//     );
//     console.log(
//       '║  Registre suas operações de compra e venda de ações       ║',
//     );
//     console.log(
//       '║  e calcule os impostos automaticamente                    ║',
//     );
//     console.log(
//       '╚════════════════════════════════════════════════════════════╝',
//     );
//     console.log('\n');
//   }

//   private showGoodbye(): void {
//     console.log('\n');
//     console.log(
//       '╔════════════════════════════════════════════════════════════╗',
//     );
//     console.log(
//       '║                    👋 ¡Hasta luego!                        ║',
//     );
//     console.log(
//       '║                                                            ║',
//     );
//     console.log(
//       '║          Obrigado por usar o Capital Gains Calculator     ║',
//     );
//     console.log(
//       '╚════════════════════════════════════════════════════════════╝',
//     );
//     console.log('\n');
//   }

//   private async handleBuy(): Promise<void> {
//     this.ui.clear();
//     console.log('\n🛒 REGISTRAR COMPRA DE AÇÕES\n');

//     // ✅ Validación robusta de cantidad
//     const quantity = await this.ui.promptNumber({
//       message: 'Quantidade de ações (número inteiro):',
//       validate: (input) => {
//         if (!Number.isInteger(input)) {
//           return 'A quantidade deve ser um número inteiro';
//         }
//         if (input <= 0) {
//           return 'A quantidade deve ser maior que 0';
//         }
//         if (input > 1000000) {
//           return 'Quantidade máxima: 1.000.000 ações';
//         }
//         return true;
//       },
//     });

//     // ✅ Validación robusta de precio
//     const unitCost = await this.ui.promptNumber({
//       message: 'Preço unitário (R$):',
//       validate: (input) => {
//         if (input <= 0) {
//           return 'O preço deve ser maior que 0';
//         }
//         if (input > 1000000) {
//           return 'Preço máximo: R$ 1.000.000';
//         }
//         return true;
//       },
//     });

//     const totalValue = quantity * unitCost;

//     console.log('\n📋 Resumo da Operação:');
//     console.log('═'.repeat(50));
//     console.log(`   Operação:      COMPRA`);
//     console.log(`   Quantidade:    ${quantity} ações`);
//     console.log(`   Preço unit.:   R$ ${unitCost.toFixed(2)}`);
//     console.log(`   Valor total:   R$ ${totalValue.toFixed(2)}`);
//     console.log('═'.repeat(50));

//     const confirm = await this.ui.promptConfirm({
//       message: '\nConfirmar operação?',
//       default: true,
//     });

//     if (!confirm) {
//       this.ui.showMessage('Operação cancelada', 'info');
//       await this.ui.pause();
//       return;
//     }

//     const result = await this.interactiveProcessor.processOperation({
//       operation: 'buy',
//       quantity,
//       'unit-cost': unitCost,
//     });

//     this.history.push({
//       operation: 'buy',
//       unitCost,
//       quantity,
//       tax: result.tax,
//       timestamp: new Date(),
//     });

//     const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

//     console.log('\n✅ Compra registrada com sucesso!\n');
//     console.log('📊 Portafolio Atualizado:');
//     console.log('═'.repeat(50));
//     console.log(`   Total de ações:         ${portfolio.totalShares}`);
//     console.log(
//       `   Preço médio ponderado:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
//     );
//     console.log(
//       `   Prejuízo acumulado:     R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
//     );
//     console.log(`   Imposto pago:           R$ ${result.tax.toFixed(2)}`);
//     console.log('═'.repeat(50));

//     await this.ui.pause();
//   }

//   private async handleSell(): Promise<void> {
//     const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

//     if (portfolio.totalShares === 0) {
//       this.ui.clear();
//       this.ui.showMessage(
//         '\n⚠️  Você não possui ações para vender. Registre uma compra primeiro.',
//         'error',
//       );
//       await this.ui.pause();
//       return;
//     }

//     this.ui.clear();
//     console.log('\n💸 REGISTRAR VENDA DE AÇÕES\n');
//     console.log('═'.repeat(50));
//     console.log(`   Ações disponíveis:  ${portfolio.totalShares}`);
//     console.log(
//       `   Preço médio atual:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
//     );
//     console.log('═'.repeat(50));
//     console.log('');

//     // ✅ Validación robusta de cantidad (no puede vender más de lo que tiene)
//     const quantity = await this.ui.promptNumber({
//       message: 'Quantidade de ações a vender (número inteiro):',
//       validate: (input) => {
//         if (!Number.isInteger(input)) {
//           return 'A quantidade deve ser um número inteiro';
//         }
//         if (input <= 0) {
//           return 'A quantidade deve ser maior que 0';
//         }
//         if (input > portfolio.totalShares) {
//           return `Você só possui ${portfolio.totalShares} ações disponíveis`;
//         }
//         return true;
//       },
//     });

//     // ✅ Validación robusta de precio
//     const unitCost = await this.ui.promptNumber({
//       message: 'Preço de venda unitário (R$):',
//       validate: (input) => {
//         if (input <= 0) {
//           return 'O preço deve ser maior que 0';
//         }
//         if (input > 1000000) {
//           return 'Preço máximo: R$ 1.000.000';
//         }
//         return true;
//       },
//     });

//     const totalValue = quantity * unitCost;
//     const avgCost = portfolio.weightedAveragePrice * quantity;
//     const profitOrLoss = totalValue - avgCost;

//     console.log('\n📋 Resumo da Operação:');
//     console.log('═'.repeat(50));
//     console.log(`   Operação:           VENDA`);
//     console.log(`   Quantidade:         ${quantity} ações`);
//     console.log(`   Preço venda unit.:  R$ ${unitCost.toFixed(2)}`);
//     console.log(
//       `   Preço médio atual:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
//     );
//     console.log(`   Valor total:        R$ ${totalValue.toFixed(2)}`);
//     console.log(
//       `   Lucro/Prejuízo:     R$ ${profitOrLoss.toFixed(2)} ${profitOrLoss >= 0 ? '📈' : '📉'}`,
//     );

//     // ✅ Mostrar si aplica el límite de R$ 20k
//     if (totalValue <= 20000 && profitOrLoss > 0) {
//       console.log(`   ℹ️  Operação ≤ R$ 20.000: isenta de imposto`);
//     }

//     console.log('═'.repeat(50));

//     const confirm = await this.ui.promptConfirm({
//       message: '\nConfirmar operação?',
//       default: true,
//     });

//     if (!confirm) {
//       this.ui.showMessage('Operação cancelada', 'info');
//       await this.ui.pause();
//       return;
//     }

//     const result = await this.interactiveProcessor.processOperation({
//       operation: 'sell',
//       quantity,
//       'unit-cost': unitCost,
//     });

//     this.history.push({
//       operation: 'sell',
//       unitCost,
//       quantity,
//       tax: result.tax,
//       timestamp: new Date(),
//     });

//     const updatedPortfolio =
//       await this.interactiveProcessor.getCurrentPortfolio();

//     console.log('\n✅ Venda registrada com sucesso!\n');
//     console.log('📊 Portafolio Atualizado:');
//     console.log('═'.repeat(50));
//     console.log(`   Ações restantes:        ${updatedPortfolio.totalShares}`);
//     console.log(
//       `   Preço médio ponderado:  R$ ${updatedPortfolio.weightedAveragePrice.toFixed(2)}`,
//     );
//     console.log(
//       `   Prejuízo acumulado:     R$ ${updatedPortfolio.accumulatedLoss.toFixed(2)}`,
//     );
//     console.log(`   Imposto devido:         R$ ${result.tax.toFixed(2)}`);
//     console.log('═'.repeat(50));

//     if (result.tax > 0) {
//       console.log(
//         `\n💰 Você deve pagar R$ ${result.tax.toFixed(2)} de imposto (20% sobre o lucro tributável).`,
//       );
//     } else if (profitOrLoss < 0) {
//       console.log(
//         `\n📉 Prejuízo de R$ ${Math.abs(profitOrLoss).toFixed(2)} acumulado para dedução futura.`,
//       );
//     } else if (totalValue <= 20000) {
//       console.log(`\n✅ Operação isenta de imposto (valor total ≤ R$ 20.000).`);
//     }

//     await this.ui.pause();
//   }

//   private async handleView(): Promise<void> {
//     this.ui.clear();
//     const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

//     console.log('\n📊 ESTADO ATUAL DO PORTAFOLIO\n');
//     console.log(
//       '╔════════════════════════════════════════════════════════════╗',
//     );
//     console.log(
//       '║                      Resumo Geral                          ║',
//     );
//     console.log(
//       '╚════════════════════════════════════════════════════════════╝',
//     );
//     console.log('');
//     console.log(`   📦 Total de ações:              ${portfolio.totalShares}`);
//     console.log(
//       `   💵 Preço médio ponderado:       R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
//     );
//     console.log(
//       `   📉 Prejuízo acumulado:          R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
//     );

//     const totalValue = portfolio.totalShares * portfolio.weightedAveragePrice;
//     console.log(
//       `   💰 Valor total investido:       R$ ${totalValue.toFixed(2)}`,
//     );
//     console.log('');
//     console.log('═'.repeat(62));

//     const totalTax = this.history.reduce((sum, op) => sum + op.tax, 0);
//     console.log(`\n   💸 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);
//     console.log(`   📝 Total de operações:      ${this.history.length}`);
//     console.log('');

//     await this.ui.pause();
//   }

//   private async handleHistory(): Promise<void> {
//     this.ui.clear();

//     if (this.history.length === 0) {
//       this.ui.showMessage('\nℹ️  Nenhuma operação registrada ainda', 'info');
//       await this.ui.pause();
//       return;
//     }

//     console.log('\n📜 HISTORIAL DE OPERAÇÕES\n');
//     console.log(
//       '┌────┬──────────┬────────────┬─────────────┬──────────────┬─────────────────────┐',
//     );
//     console.log(
//       '│ #  │ Tipo     │ Quantidade │ Preço Unit  │ Imposto      │ Data/Hora           │',
//     );
//     console.log(
//       '├────┼──────────┼────────────┼─────────────┼──────────────┼─────────────────────┤',
//     );

//     this.history.forEach((op, index) => {
//       const num = String(index + 1).padStart(2);
//       const type = op.operation === 'buy' ? '🛒 COMPRA' : '💸 VENDA ';
//       const qty = String(op.quantity).padStart(10);
//       const price = `R$ ${op.unitCost.toFixed(2)}`.padStart(11);
//       const tax = `R$ ${op.tax.toFixed(2)}`.padStart(12);
//       const date = op.timestamp
//         .toLocaleString('pt-BR', {
//           dateStyle: 'short',
//           timeStyle: 'short',
//         })
//         .padStart(19);

//       console.log(
//         `│ ${num} │ ${type} │ ${qty} │ ${price} │ ${tax} │ ${date} │`,
//       );
//     });

//     console.log(
//       '└────┴──────────┴────────────┴─────────────┴──────────────┴─────────────────────┘',
//     );

//     const totalTax = this.history.reduce((sum, op) => sum + op.tax, 0);
//     console.log(`\n💰 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);

//     await this.ui.pause();
//   }

//   private async handleReset(): Promise<void> {
//     this.ui.clear();

//     const confirm = await this.ui.promptConfirm({
//       message:
//         '\n⚠️  Tem certeza que deseja resetar o portafolio? Todos os dados serão perdidos.',
//       default: false,
//     });

//     if (!confirm) {
//       this.ui.showMessage('Reset cancelado', 'info');
//       await this.ui.pause();
//       return;
//     }

//     await this.interactiveProcessor.resetPortfolio();
//     this.history = [];

//     this.ui.showMessage('\n✅ Portafolio resetado com sucesso!', 'success');
//     await this.ui.pause();
//   }

//   private async handleExport(): Promise<void> {
//     this.ui.clear();

//     if (this.history.length === 0) {
//       this.ui.showMessage('\n⚠️  Nenhuma operação para exportar', 'error');
//       await this.ui.pause();
//       return;
//     }

//     const operations = this.history.map((op) => ({
//       operation: op.operation,
//       'unit-cost': op.unitCost,
//       quantity: op.quantity,
//     }));

//     const results = this.history.map((op) => ({ tax: op.tax }));

//     console.log('\n📄 FORMATO DE EXPORTAÇÃO:\n');
//     console.log('═'.repeat(62));
//     console.log('\n✅ Entrada (operations):');
//     console.log(JSON.stringify(operations));
//     console.log('\n✅ Saída (results):');
//     console.log(JSON.stringify(results));
//     console.log('\n');
//     console.log('═'.repeat(62));
//     console.log(
//       '\n💡 Dica: Copie e cole no arquivo input.txt para testar novamente\n',
//     );

//     await this.ui.pause();
//   }
// }

// src/cli/application/use-cases/run-interactive-mode.use-case.ts
// src/cli/application/use-cases/run-interactive-mode.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { InteractiveProcessorService } from '../services/interactive-processor.service';
import {
  IInteractiveUI,
  INTERACTIVE_UI,
} from '../../domain/ports/interactive-ui.port';
import { OperationHistoryService } from '../services/operation-history.service';

@Injectable()
export class RunInteractiveModeUseCase {
  constructor(
    private readonly interactiveProcessor: InteractiveProcessorService,
    @Inject(INTERACTIVE_UI)
    private readonly ui: IInteractiveUI,
    private readonly historyService: OperationHistoryService,
  ) {}

  async execute(): Promise<void> {
    this.ui.clear();
    this.showWelcome();

    let running = true;

    while (running) {
      const action = await this.ui.showMenu([
        { name: '🛒 Registrar compra', value: 'buy' },
        { name: '💸 Registrar venda', value: 'sell' },
        { name: '📊 Ver portafolio atual', value: 'view' },
        { name: '📜 Ver historial de operações', value: 'history' },
        { name: '🔄 Resetar portafolio', value: 'reset' },
        { name: '💾 Exportar resultados', value: 'export' },
        { name: '❌ Sair', value: 'exit' },
      ]);

      try {
        switch (action) {
          case 'buy':
            await this.handleBuy();
            break;
          case 'sell':
            await this.handleSell();
            break;
          case 'view':
            await this.handleView();
            break;
          case 'history':
            await this.handleHistory();
            break;
          case 'reset':
            await this.handleReset();
            break;
          case 'export':
            await this.handleExport();
            break;
          case 'exit':
            running = false;
            this.showGoodbye();
            break;
        }
      } catch (error) {
        this.ui.clear();
        this.ui.showMessage(
          `\n⚠️  Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          'error',
        );
        await this.ui.pause();
      }
    }
  }

  private showWelcome(): void {
    console.log('\n');
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║        🏦 Capital Gains Calculator - Interactive Mode      ║',
    );
    console.log(
      '║                                                            ║',
    );
    console.log(
      '║  Registre suas operações de compra e venda de ações       ║',
    );
    console.log(
      '║  e calcule os impostos automaticamente                    ║',
    );
    console.log(
      '╚════════════════════════════════════════════════════════════╝',
    );
    console.log('\n');
  }

  private showGoodbye(): void {
    console.log('\n');
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║                    👋 ¡Hasta luego!                        ║',
    );
    console.log(
      '║                                                            ║',
    );
    console.log(
      '║          Obrigado por usar o Capital Gains Calculator     ║',
    );
    console.log(
      '╚════════════════════════════════════════════════════════════╝',
    );
    console.log('\n');
  }

  private async handleBuy(): Promise<void> {
    this.ui.clear();
    console.log('\n🛒 REGISTRAR COMPRA DE AÇÕES\n');

    const quantity = await this.ui.promptNumber({
      message: 'Quantidade de ações (número inteiro):',
      validate: (input) => {
        if (!Number.isInteger(input)) {
          return 'A quantidade deve ser um número inteiro';
        }
        if (input <= 0) {
          return 'A quantidade deve ser maior que 0';
        }
        if (input > 1000000) {
          return 'Quantidade máxima: 1.000.000 ações';
        }
        return true;
      },
    });

    const unitCost = await this.ui.promptNumber({
      message: 'Preço unitário (R$):',
      validate: (input) => {
        if (input <= 0) {
          return 'O preço deve ser maior que 0';
        }
        if (input > 1000000) {
          return 'Preço máximo: R$ 1.000.000';
        }
        return true;
      },
    });

    const totalValue = quantity * unitCost;

    console.log('\n📋 Resumo da Operação:');
    console.log('═'.repeat(50));
    console.log(`   Operação:      COMPRA`);
    console.log(`   Quantidade:    ${quantity} ações`);
    console.log(`   Preço unit.:   R$ ${unitCost.toFixed(2)}`);
    console.log(`   Valor total:   R$ ${totalValue.toFixed(2)}`);
    console.log('═'.repeat(50));

    const confirm = await this.ui.promptConfirm({
      message: '\nConfirmar operação?',
      default: true,
    });

    if (!confirm) {
      this.ui.showMessage('Operação cancelada', 'info');
      await this.ui.pause();
      return;
    }

    const result = await this.interactiveProcessor.processOperation({
      operation: 'buy',
      quantity,
      'unit-cost': unitCost,
    });

    this.historyService.add({
      operation: 'buy',
      unitCost,
      quantity,
      tax: result.tax,
      timestamp: new Date(),
    });

    const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

    console.log('\n✅ Compra registrada com sucesso!\n');
    console.log('📊 Portafolio Atualizado:');
    console.log('═'.repeat(50));
    console.log(`   Total de ações:         ${portfolio.totalShares}`);
    console.log(
      `   Preço médio ponderado:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   Prejuízo acumulado:     R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
    );
    console.log(`   Imposto pago:           R$ ${result.tax.toFixed(2)}`);
    console.log('═'.repeat(50));

    await this.ui.pause();
  }

  private async handleSell(): Promise<void> {
    const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

    if (portfolio.totalShares === 0) {
      this.ui.clear();
      this.ui.showMessage(
        '\n⚠️  Você não possui ações para vender. Registre uma compra primeiro.',
        'error',
      );
      await this.ui.pause();
      return;
    }

    this.ui.clear();
    console.log('\n💸 REGISTRAR VENDA DE AÇÕES\n');
    console.log('═'.repeat(50));
    console.log(`   Ações disponíveis:  ${portfolio.totalShares}`);
    console.log(
      `   Preço médio atual:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log('═'.repeat(50));
    console.log('');

    const quantity = await this.ui.promptNumber({
      message: 'Quantidade de ações a vender (número inteiro):',
      validate: (input) => {
        if (!Number.isInteger(input)) {
          return 'A quantidade deve ser um número inteiro';
        }
        if (input <= 0) {
          return 'A quantidade deve ser maior que 0';
        }
        if (input > portfolio.totalShares) {
          return `Você só possui ${portfolio.totalShares} ações disponíveis`;
        }
        return true;
      },
    });

    const unitCost = await this.ui.promptNumber({
      message: 'Preço de venda unitário (R$):',
      validate: (input) => {
        if (input <= 0) {
          return 'O preço deve ser maior que 0';
        }
        if (input > 1000000) {
          return 'Preço máximo: R$ 1.000.000';
        }
        return true;
      },
    });

    const totalValue = quantity * unitCost;
    const avgCost = portfolio.weightedAveragePrice * quantity;
    const profitOrLoss = totalValue - avgCost;

    console.log('\n📋 Resumo da Operação:');
    console.log('═'.repeat(50));
    console.log(`   Operação:           VENDA`);
    console.log(`   Quantidade:         ${quantity} ações`);
    console.log(`   Preço venda unit.:  R$ ${unitCost.toFixed(2)}`);
    console.log(
      `   Preço médio atual:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(`   Valor total:        R$ ${totalValue.toFixed(2)}`);
    console.log(
      `   Lucro/Prejuízo:     R$ ${profitOrLoss.toFixed(2)} ${profitOrLoss >= 0 ? '📈' : '📉'}`,
    );

    if (totalValue <= 20000 && profitOrLoss > 0) {
      console.log(`   ℹ️  Operação ≤ R$ 20.000: isenta de imposto`);
    }

    console.log('═'.repeat(50));

    const confirm = await this.ui.promptConfirm({
      message: '\nConfirmar operação?',
      default: true,
    });

    if (!confirm) {
      this.ui.showMessage('Operação cancelada', 'info');
      await this.ui.pause();
      return;
    }

    const result = await this.interactiveProcessor.processOperation({
      operation: 'sell',
      quantity,
      'unit-cost': unitCost,
    });

    this.historyService.add({
      operation: 'sell',
      unitCost,
      quantity,
      tax: result.tax,
      timestamp: new Date(),
    });

    const updatedPortfolio =
      await this.interactiveProcessor.getCurrentPortfolio();

    console.log('\n✅ Venda registrada com sucesso!\n');
    console.log('📊 Portafolio Atualizado:');
    console.log('═'.repeat(50));
    console.log(`   Ações restantes:        ${updatedPortfolio.totalShares}`);
    console.log(
      `   Preço médio ponderado:  R$ ${updatedPortfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   Prejuízo acumulado:     R$ ${updatedPortfolio.accumulatedLoss.toFixed(2)}`,
    );
    console.log(`   Imposto devido:         R$ ${result.tax.toFixed(2)}`);
    console.log('═'.repeat(50));

    if (result.tax > 0) {
      console.log(
        `\n💰 Você deve pagar R$ ${result.tax.toFixed(2)} de imposto (20% sobre o lucro tributável).`,
      );
    } else if (profitOrLoss < 0) {
      console.log(
        `\n📉 Prejuízo de R$ ${Math.abs(profitOrLoss).toFixed(2)} acumulado para dedução futura.`,
      );
    } else if (totalValue <= 20000) {
      console.log(`\n✅ Operação isenta de imposto (valor total ≤ R$ 20.000).`);
    }

    await this.ui.pause();
  }

  private async handleView(): Promise<void> {
    this.ui.clear();
    const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

    console.log('\n📊 ESTADO ATUAL DO PORTAFOLIO\n');
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║                      Resumo Geral                          ║',
    );
    console.log(
      '╚════════════════════════════════════════════════════════════╝',
    );
    console.log('');
    console.log(`   📦 Total de ações:              ${portfolio.totalShares}`);
    console.log(
      `   💵 Preço médio ponderado:       R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   📉 Prejuízo acumulado:          R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
    );

    const totalValue = portfolio.totalShares * portfolio.weightedAveragePrice;
    console.log(
      `   💰 Valor total investido:       R$ ${totalValue.toFixed(2)}`,
    );
    console.log('');
    console.log('═'.repeat(62));

    const totalTax = this.historyService.getTotalTax();
    const totalOps = this.historyService.getCount();
    console.log(`\n   💸 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);
    console.log(`   📝 Total de operações:      ${totalOps}`);
    console.log('');

    await this.ui.pause();
  }

  private async handleHistory(): Promise<void> {
    this.ui.clear();

    const history = this.historyService.getAll();

    if (history.length === 0) {
      this.ui.showMessage('\nℹ️  Nenhuma operação registrada ainda', 'info');
      await this.ui.pause();
      return;
    }

    console.log('\n📜 HISTORIAL DE OPERAÇÕES\n');
    console.log(
      '┌────┬──────────┬────────────┬─────────────┬──────────────┬─────────────────────┐',
    );
    console.log(
      '│ #  │ Tipo     │ Quantidade │ Preço Unit  │ Imposto      │ Data/Hora           │',
    );
    console.log(
      '├────┼──────────┼────────────┼─────────────┼──────────────┼─────────────────────┤',
    );

    history.forEach((op, index) => {
      const num = String(index + 1).padStart(2);
      const type = op.operation === 'buy' ? '🛒 COMPRA' : '💸 VENDA ';
      const qty = String(op.quantity).padStart(10);
      const price = `R$ ${op.unitCost.toFixed(2)}`.padStart(11);
      const tax = `R$ ${op.tax.toFixed(2)}`.padStart(12);
      const date = op.timestamp
        .toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
        .padStart(19);

      console.log(
        `│ ${num} │ ${type} │ ${qty} │ ${price} │ ${tax} │ ${date} │`,
      );
    });

    console.log(
      '└────┴──────────┴────────────┴─────────────┴──────────────┴─────────────────────┘',
    );

    const totalTax = this.historyService.getTotalTax();
    console.log(`\n💰 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);

    await this.ui.pause();
  }

  private async handleReset(): Promise<void> {
    this.ui.clear();

    const confirm = await this.ui.promptConfirm({
      message:
        '\n⚠️  Tem certeza que deseja resetar o portafolio? Todos os dados serão perdidos.',
      default: false,
    });

    if (!confirm) {
      this.ui.showMessage('Reset cancelado', 'info');
      await this.ui.pause();
      return;
    }

    await this.interactiveProcessor.resetPortfolio();
    this.historyService.clear();

    this.ui.showMessage('\n✅ Portafolio resetado com sucesso!', 'success');
    await this.ui.pause();
  }

  private async handleExport(): Promise<void> {
    this.ui.clear();

    const history = this.historyService.getAll();

    if (history.length === 0) {
      this.ui.showMessage('\n⚠️  Nenhuma operação para exportar', 'error');
      await this.ui.pause();
      return;
    }

    const operations = history.map((op) => ({
      operation: op.operation,
      'unit-cost': op.unitCost,
      quantity: op.quantity,
    }));

    const results = history.map((op) => ({ tax: op.tax }));

    console.log('\n📄 FORMATO DE EXPORTAÇÃO:\n');
    console.log('═'.repeat(62));
    console.log('\n✅ Entrada (operations):');
    console.log(JSON.stringify(operations));
    console.log('\n✅ Saída (results):');
    console.log(JSON.stringify(results));
    console.log('\n');
    console.log('═'.repeat(62));
    console.log(
      '\n💡 Dica: Copie e cole no arquivo input.txt para testar novamente\n',
    );

    await this.ui.pause();
  }
}
