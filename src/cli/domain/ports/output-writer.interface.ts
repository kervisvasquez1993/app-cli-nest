export const OUTPUT_WRITER = Symbol('IOutputWriter');

export interface IOutputWriter {
  write(message: string): void;
  writeError(message: string): void;
  writeSuccess(message: string): void;
  clear(): void;
}
