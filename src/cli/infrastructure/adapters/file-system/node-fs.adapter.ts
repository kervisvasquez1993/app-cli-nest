import { Injectable } from '@nestjs/common';
import { IFileSystem } from '../../../domain/ports/file-system.port';
import * as fs from 'fs/promises';
import { FileNotFoundError } from '../../../domain/errors/cli.errors';

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error;
}

@Injectable()
export class NodeFileSystemAdapter implements IFileSystem {
  async readFile(path: string, encoding: 'utf-8'): Promise<string> {
    try {
      return await fs.readFile(path, encoding);
    } catch (error: unknown) {
      if (isErrnoException(error) && error.code === 'ENOENT') {
        throw new FileNotFoundError(path);
      }

      throw new Error(
        `Failed to read file ${path}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
