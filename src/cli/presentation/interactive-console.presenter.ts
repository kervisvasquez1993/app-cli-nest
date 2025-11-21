import { Injectable } from '@nestjs/common';
import { PortfolioSnapshot } from '../application/services/interactive-processor.service';
import { OperationHistory } from '../application/services/operation-history.service';

@Injectable()
export class InteractiveConsolePresenter {
  showWelcome(): void {
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

  showGoodbye(): void {
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

  showBuySummary(quantity: number, unitCost: number, totalValue: number): void {
    console.log('\n📋 Resumo da Operação:');
    console.log('═'.repeat(50));
    console.log(`   Operação:      COMPRA`);
    console.log(`   Quantidade:    ${quantity} ações`);
    console.log(`   Preço unit.:   R$ ${unitCost.toFixed(2)}`);
    console.log(`   Valor total:   R$ ${totalValue.toFixed(2)}`);
    console.log('═'.repeat(50));
  }

  showSellSummary(
    portfolio: PortfolioSnapshot,
    quantity: number,
    unitCost: number,
  ): { totalValue: number; profitOrLoss: number } {
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
    console.log('═'.repeat(50));

    return { totalValue, profitOrLoss };
  }

  showUpdatedPortfolioAfterBuy(
    portfolio: PortfolioSnapshot,
    tax: number,
  ): void {
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
    console.log(`   Imposto pago:           R$ ${tax.toFixed(2)}`);
    console.log('═'.repeat(50));
  }

  showUpdatedPortfolioAfterSell(
    portfolio: PortfolioSnapshot,
    tax: number,
  ): void {
    console.log('\n✅ Venda registrada com sucesso!\n');
    console.log('📊 Portafolio Atualizado:');
    console.log('═'.repeat(50));
    console.log(`   Ações restantes:        ${portfolio.totalShares}`);
    console.log(
      `   Preço médio ponderado:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   Prejuízo acumulado:     R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
    );
    console.log(`   Imposto devido:         R$ ${tax.toFixed(2)}`);
    console.log('═'.repeat(50));
  }

  showPortfolioState(
    portfolio: PortfolioSnapshot,
    totalTax: number,
    totalOps: number,
  ): void {
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
    console.log(`\n   💸 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);
    console.log(`   📝 Total de operações:      ${totalOps}`);
    console.log('');
  }

  showHistory(history: OperationHistory[], totalTax: number): void {
    console.log('\n📜 HISTORIAL DE OPERAÇÕES\n');
    console.log(
      '┌────┬──────────┬────────────┬─────────────┬──────────────┬─────────────────────┐',
    );
    console.log(
      '│ #  │ Tipo     │ Quantidade │ Preço Unit  │ Imposto      │ Data/Hora           │',
    );
    console.log(
      '├────┼──────────┼────────────┼─────────────┬──────────────┼─────────────────────┤',
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
    console.log(`\n💰 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);
  }

  showExportPreview(operations: any[], results: any[]): void {
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
  }
}
