import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export enum OperationTypeDto {
  BUY = 'buy',
  SELL = 'sell',
}

export class OperationDto {
  @IsEnum(OperationTypeDto)
  operation: OperationTypeDto;

  @IsNumber()
  @IsPositive()
  'unit-cost': number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}