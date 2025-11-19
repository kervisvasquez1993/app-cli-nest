export class Money {
  private constructor(private readonly amount: number) {}

  static from(amount: number): Money {
    return new Money(amount);
  }

  static zero(): Money {
    return new Money(0);
  }

  getValue(): number {
    return this.amount;
  }

  round(): Money {
    return new Money(Math.round(this.amount * 100) / 100);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return new Money(this.amount - other.amount);
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  abs(): Money {
    return new Money(Math.abs(this.amount));
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  isLessThanOrEqual(other: Money): boolean {
    return this.amount <= other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  toString(): string {
    return `R$ ${this.amount.toFixed(2)}`;
  }
}
