export const VALIDATION_SERVICE = Symbol('IValidationService');

export interface IValidationService {
  validateDto<T extends object>(
    dtoClass: new () => T,
    plain: unknown,
  ): Promise<T>;
  validateArray<T extends object>(
    dtoClass: new () => T,
    plainArray: unknown,
  ): Promise<T[]>;
}
