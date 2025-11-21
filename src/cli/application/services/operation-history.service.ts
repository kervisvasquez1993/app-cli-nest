// src/cli/application/services/operation-history.service.ts
import { Injectable } from '@nestjs/common';

export interface OperationHistory {
  operation: 'buy' | 'sell';
  unitCost: number;
  quantity: number;
  tax: number;
  timestamp: Date;
}

@Injectable()
export class OperationHistoryService {
  private history: OperationHistory[] = [];

  add(operation: OperationHistory): void {
    this.history.push(operation);
  }

  getAll(): OperationHistory[] {
    return [...this.history];
  }

  getTotalTax(): number {
    return this.history.reduce((sum, op) => sum + op.tax, 0);
  }

  getCount(): number {
    return this.history.length;
  }

  clear(): void {
    this.history = [];
  }
}
