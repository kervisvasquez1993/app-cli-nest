// src/application/services/operation-history.service.ts
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

  async add(operation: OperationHistory): Promise<void> {
    this.history.push(operation);
  }

  async getAll(): Promise<OperationHistory[]> {
    return [...this.history];
  }

  async getTotalTax(): Promise<number> {
    return this.history.reduce((sum, op) => sum + op.tax, 0);
  }

  async getCount(): Promise<number> {
    return this.history.length;
  }

  async clear(): Promise<void> {
    this.history = [];
  }
}
