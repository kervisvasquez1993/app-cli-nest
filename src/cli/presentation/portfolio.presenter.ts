// src/presentation/portfolio.presenter.ts
import { Injectable } from '@nestjs/common';
import { IInteractiveUI } from '../domain/ports/interactive-ui.port';

@Injectable()
export class PortfolioPresenter {
  async show(
    portfolio: any,
    totalTax: number,
    totalOperations: number,
    ui: IInteractiveUI,
  ): Promise<void> {
    ui.clear();

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
    console.log(`   📝 Total de operações:      ${totalOperations}`);
    console.log('');

    await ui.pause();
  }
}
