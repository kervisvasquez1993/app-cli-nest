export const FILE_SYSTEM = Symbol('IFileSystem');

export interface IFileSystem {
  readFile(path: string, encoding: 'utf-8'): Promise<string>;
}
