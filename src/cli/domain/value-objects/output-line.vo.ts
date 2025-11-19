export class OutputLine {
  private constructor(private readonly content: unknown) {}

  static fromJSON(content: unknown): OutputLine {
    return new OutputLine(content);
  }

  toJSONString(): string {
    return JSON.stringify(this.content);
  }

  getContent(): unknown {
    return this.content;
  }
}
