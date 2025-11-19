export class TaxResultDto {
  tax: number;

  constructor(tax: number) {
    this.tax = Math.round(tax * 100) / 100;
  }
}
