import { OperationType } from '../enums/operation-type.enum';
import { Money } from '../value-objects/money.vo';
import { Quantity } from '../value-objects/quantity.vo';

export class Operation {
  private constructor(
    private readonly type: OperationType,
    private readonly unitCost: Money,
    private readonly quantity: Quantity,
  ) {}

  static create(
    type: OperationType,
    unitCost: number,
    quantity: number,
  ): Operation {
    return new Operation(type, Money.from(unitCost), Quantity.from(quantity));
  }

  getType(): OperationType {
    return this.type;
  }

  getUnitCost(): Money {
    return this.unitCost;
  }

  getQuantity(): Quantity {
    return this.quantity;
  }

  getTotalValue(): Money {
    return this.unitCost.multiply(this.quantity.getValue());
  }

  isBuy(): boolean {
    return this.type === OperationType.BUY;
  }

  isSell(): boolean {
    return this.type === OperationType.SELL;
  }
}
