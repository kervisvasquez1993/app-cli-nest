import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IValidationService } from '../ports/validation.port';

@Injectable()
export class ValidationService implements IValidationService {
  async validateDto<T extends object>(
    dtoClass: new () => T,
    plain: unknown,
  ): Promise<T> {
    const dtoInstance = plainToClass(dtoClass, plain);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return dtoInstance;
  }

  async validateArray<T extends object>(
    dtoClass: new () => T,
    plainArray: unknown,
  ): Promise<T[]> {
    if (!Array.isArray(plainArray)) {
      throw new BadRequestException('Expected an array of operations');
    }

    const validatedArray: T[] = [];

    for (let i = 0; i < plainArray.length; i++) {
      try {
        const validated = await this.validateDto(dtoClass, plainArray[i]);
        validatedArray.push(validated);
      } catch (error) {
        if (this.isBadRequestException(error)) {
          throw new BadRequestException({
            message: `Validation failed at operation index ${i}`,
            error: error.getResponse(),
          });
        }

        throw new BadRequestException({
          message: `Validation failed at operation index ${i}`,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return validatedArray;
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }
    });

    return formatted;
  }

  private isBadRequestException(error: unknown): error is BadRequestException {
    return error instanceof BadRequestException;
  }
}
