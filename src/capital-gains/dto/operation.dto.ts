import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { OperationType } from '../enums/operation-type.enum';

export class OperationDto {
  @IsEnum(OperationType)
  operation: OperationType;

  @IsNumber()
  @IsPositive()
  'unit-cost': number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
