import { InputLine } from '../domain/value-objects/input-line.vo';

export function toInputLines(rawLines: string[]): InputLine[] {
  return rawLines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => InputLine.from(line));
}
