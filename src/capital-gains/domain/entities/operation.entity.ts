import { OperationType } from '../../enums/operation-type.enum';

export class Operation {
  constructor(
    public readonly operation: OperationType,
    public readonly unitCost: number,
    public readonly quantity: number,
  ) {}

  getTotalValue(): number {
    return this.unitCost * this.quantity;
  }

  isBuy(): boolean {
    return this.operation === OperationType.BUY;
  }

  isSell(): boolean {
    return this.operation === OperationType.SELL;
  }
}
