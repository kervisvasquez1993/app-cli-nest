// src/cli/domain/errors/cli.errors.ts

export abstract class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class FileNotFoundError extends CLIError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`, 'FILE_NOT_FOUND', { filePath });
  }
}

export class InvalidInputFormatError extends CLIError {
  constructor(line: string, reason: string) {
    super(`Invalid input format: ${reason}`, 'INVALID_INPUT_FORMAT', {
      line,
      reason,
    });
  }
}

export class EmptyFileError extends CLIError {
  constructor(filePath: string) {
    super(`File is empty: ${filePath}`, 'EMPTY_FILE', { filePath });
  }
}

export class CommandNotFoundError extends CLIError {
  constructor(commandName: string, availableCommands: string[]) {
    super(`Command not found: ${commandName}`, 'COMMAND_NOT_FOUND', {
      commandName,
      availableCommands,
    });
  }
}
