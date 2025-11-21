export class OutputLine {
  private constructor(private readonly line: string) {}

  static fromString(line: string): OutputLine {
    return new OutputLine(line);
  }

  toJSONString(): string {
    return this.line;
  }

  getContent(): string {
    return this.line;
  }
}
