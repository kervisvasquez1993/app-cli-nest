import { Injectable, Inject } from '@nestjs/common';
import { InteractiveProcessorService } from '../services/interactive-processor.service';
import {
  IInteractiveUI,
  INTERACTIVE_UI,
} from '../../domain/ports/interactive-ui.port';
import { OperationHistoryService } from '../services/operation-history.service';
import { InteractiveConsolePresenter } from '../../presentation/interactive-console.presenter';

@Injectable()
export class RunInteractiveModeUseCase {
  constructor(
    private readonly interactiveProcessor: InteractiveProcessorService,
    @Inject(INTERACTIVE_UI)
    private readonly ui: IInteractiveUI,
    private readonly historyService: OperationHistoryService,
    private readonly presenter: InteractiveConsolePresenter,
  ) {}

  async execute(): Promise<void> {
    this.ui.clear();
    this.presenter.showWelcome();

    let running = true;

    while (running) {
      const action = await this.ui.showMenu([
        { name: '🛒 Registrar compra de ações', value: 'buy' },
        { name: '💸 Registrar venda de ações', value: 'sell' },
        { name: '📊 Ver portfólio atual', value: 'view' },
        { name: '📜 Ver histórico de operações', value: 'history' },
        { name: '🔄 Resetar portfólio', value: 'reset' },
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
            this.presenter.showGoodbye();
            break;
        }
      } catch (error) {
        this.ui.clear();
        this.ui.showMessage(
          `\n⚠️  Erro: ${
            error instanceof Error ? error.message : 'Erro desconhecido'
          }`,
          'error',
        );
        await this.ui.pause();
      }
    }
  }

  private async handleBuy(): Promise<void> {
    this.ui.clear();
    this.ui.showMessage('\n🛒 REGISTRAR COMPRA DE AÇÕES\n', 'info');

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
    this.presenter.showBuySummary(quantity, unitCost, totalValue);

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
    this.presenter.showUpdatedPortfolioAfterBuy(portfolio, result.tax);

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
    this.ui.showMessage('\n💸 REGISTRAR VENDA DE AÇÕES\n', 'info');
    this.ui.showMessage(
      `Ações disponíveis: ${portfolio.totalShares} | Preço médio atual: R$ ${portfolio.weightedAveragePrice.toFixed(
        2,
      )}`,
      'info',
    );

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

    const { totalValue, profitOrLoss } = this.presenter.showSellSummary(
      portfolio,
      quantity,
      unitCost,
    );

    if (totalValue <= 20000 && profitOrLoss > 0) {
      this.ui.showMessage(
        'ℹ️  Operação ≤ R$ 20.000: isenta de imposto',
        'info',
      );
    }

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

    this.presenter.showUpdatedPortfolioAfterSell(updatedPortfolio, result.tax);

    if (result.tax > 0) {
      this.ui.showMessage(
        `\n💰 Você deve pagar R$ ${result.tax.toFixed(
          2,
        )} de imposto (20% sobre o lucro tributável).`,
        'info',
      );
    } else if (profitOrLoss < 0) {
      this.ui.showMessage(
        `\n📉 Prejuízo de R$ ${Math.abs(profitOrLoss).toFixed(
          2,
        )} acumulado para dedução futura.`,
        'info',
      );
    } else if (totalValue <= 20000) {
      this.ui.showMessage(
        `\n✅ Operação isenta de imposto (valor total ≤ R$ 20.000).`,
        'success',
      );
    }

    await this.ui.pause();
  }

  private async handleView(): Promise<void> {
    this.ui.clear();
    const portfolio = await this.interactiveProcessor.getCurrentPortfolio();
    const totalTax = this.historyService.getTotalTax();
    const totalOps = this.historyService.getCount();

    this.presenter.showPortfolioState(portfolio, totalTax, totalOps);
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

    const totalTax = this.historyService.getTotalTax();
    this.presenter.showHistory(history, totalTax);

    await this.ui.pause();
  }

  private async handleReset(): Promise<void> {
    this.ui.clear();

    const confirm = await this.ui.promptConfirm({
      message:
        '\n⚠️  Tem certeza que deseja resetar o portfólio? Todos os dados serão perdidos.',
      default: false,
    });

    if (!confirm) {
      this.ui.showMessage('Reset cancelado', 'info');
      await this.ui.pause();
      return;
    }

    await this.interactiveProcessor.resetPortfolio();
    this.historyService.clear();

    this.ui.showMessage('\n✅ Portfólio resetado com sucesso!', 'success');
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

    this.presenter.showExportPreview(operations, results);
    await this.ui.pause();
  }
}
