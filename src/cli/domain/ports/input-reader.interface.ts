export const INPUT_READER = Symbol('IInputReader');

export interface IInputReader {
  readLine(): Promise<string>;
  readFile(path: string): Promise<string[]>;
  close(): void;
}
