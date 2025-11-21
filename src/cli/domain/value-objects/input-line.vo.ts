// export class InputLine {
//   private constructor(private readonly rawContent: string) {}

//   static from(content: string): InputLine {
//     const trimmed = content.trim();
//     if (!trimmed) {
//       throw new Error('Input line cannot be empty');
//     }
//     return new InputLine(trimmed);
//   }

//   getRawContent(): string {
//     return this.rawContent;
//   }

//   parseAsJSON<T = unknown>(): T {
//     try {
//       return JSON.parse(this.rawContent) as T;
//     } catch {
//       throw new Error(`Invalid JSON in input line: ${this.rawContent}`);
//     }
//   }
// }

import { InvalidInputFormatError } from '../errors/cli.errors';

export class InputLine {
  private constructor(private readonly rawContent: string) {}

  static from(content: string): InputLine {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Input line cannot be empty');
    }
    return new InputLine(trimmed);
  }

  getRawContent(): string {
    return this.rawContent;
  }

  parseAsJSON<T = unknown>(): T {
    try {
      return JSON.parse(this.rawContent) as T;
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Invalid JSON';
      throw new InvalidInputFormatError(this.rawContent, reason);
    }
  }
}
