// src/presentation/sell-operation.presenter.ts
import { Injectable } from '@nestjs/common';
import { IInteractiveUI } from '../domain/ports/interactive-ui.port';

export interface SellOperationInput {
  quantity: number;
  unitCost: number;
  totalValue: number;
  profitOrLoss: number;
  confirmed: boolean;
}

@Injectable()
export class SellOperationPresenter {
  async collectInput(
    ui: IInteractiveUI,
    portfolio: any,
  ): Promise<SellOperationInput> {
    ui.clear();
    console.log('\n💸 REGISTRAR VENDA DE AÇÕES\n');
    this.showPortfolioInfo(portfolio);

    const quantity = await this.promptQuantity(ui, portfolio);
    const unitCost = await this.promptPrice(ui);

    const totalValue = quantity * unitCost;
    const avgCost = portfolio.weightedAveragePrice * quantity;
    const profitOrLoss = totalValue - avgCost;

    this.showSummary(quantity, unitCost, portfolio, totalValue, profitOrLoss);

    const confirmed = await ui.promptConfirm({
      message: '\nConfirmar operação?',
      default: true,
    });

    return { quantity, unitCost, totalValue, profitOrLoss, confirmed };
  }

  async showResult(
    portfolio: any,
    result: any,
    input: SellOperationInput,
    ui: IInteractiveUI,
  ): Promise<void> {
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
    console.log(`   Imposto devido:         R$ ${result.tax.toFixed(2)}`);
    console.log('═'.repeat(50));

    this.showTaxInfo(result.tax, input);

    await ui.pause();
  }

  private showPortfolioInfo(portfolio: any): void {
    console.log('═'.repeat(50));
    console.log(`   Ações disponíveis:  ${portfolio.totalShares}`);
    console.log(
      `   Preço médio atual:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log('═'.repeat(50));
    console.log('');
  }

  private async promptQuantity(
    ui: IInteractiveUI,
    portfolio: any,
  ): Promise<number> {
    return ui.promptNumber({
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
  }

  private async promptPrice(ui: IInteractiveUI): Promise<number> {
    return ui.promptNumber({
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
  }

  private showSummary(
    quantity: number,
    unitCost: number,
    portfolio: any,
    totalValue: number,
    profitOrLoss: number,
  ): void {
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
  }

  private showTaxInfo(tax: number, input: SellOperationInput): void {
    if (tax > 0) {
      console.log(
        `\n💰 Você deve pagar R$ ${tax.toFixed(2)} de imposto (20% sobre o lucro tributável).`,
      );
    } else if (input.profitOrLoss < 0) {
      console.log(
        `\n📉 Prejuízo de R$ ${Math.abs(input.profitOrLoss).toFixed(2)} acumulado para dedução futura.`,
      );
    } else if (input.totalValue <= 20000) {
      console.log(`\n✅ Operação isenta de imposto (valor total ≤ R$ 20.000).`);
    }
  }
}
