import * as path from 'path';

export class FilePath {
  private constructor(private readonly value: string) {}

  static from(rawPath: string): FilePath {
    if (!rawPath || !rawPath.trim()) {
      throw new Error('File path cannot be empty');
    }

    const normalized = path.normalize(rawPath.trim());
    return new FilePath(normalized);
  }

  getValue(): string {
    return this.value;
  }

  getExtension(): string {
    return path.extname(this.value);
  }

  getFileName(): string {
    return path.basename(this.value);
  }

  isJSON(): boolean {
    return this.getExtension().toLowerCase() === '.json';
  }

  isTXT(): boolean {
    return this.getExtension().toLowerCase() === '.txt';
  }

  toString(): string {
    return this.value;
  }
}
