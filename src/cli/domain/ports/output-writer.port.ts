export const OUTPUT_WRITER = Symbol('IOutputWriter');

export interface IOutputWriter {
  writeLine(content: string): Promise<void>;

  writeLines(contents: string[]): Promise<void>;

  writeError(message: string): Promise<void>;
}
