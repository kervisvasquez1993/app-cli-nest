export const INPUT_READER = Symbol('IInputReader');

export interface IInputReader {
  readLines(): Promise<string[]>;
  readLine(): Promise<string>;
}
