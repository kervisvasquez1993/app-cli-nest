export class Quantity {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Quantity must be zero or positive');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
  }

  static from(value: number): Quantity {
    return new Quantity(value);
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    const result = this.value - other.value;
    if (result < 0) {
      throw new Error('Resulting quantity cannot be negative');
    }
    return new Quantity(result);
  }

  isGreaterThan(other: Quantity): boolean {
    return this.value > other.value;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }
}
