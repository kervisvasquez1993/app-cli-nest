import { OptionValue } from '../../domain/ports/cli-framework.port';

export function getRequiredStringOption(
  options: Record<string, OptionValue>,
  key: string,
  errorMessage?: string,
): string {
  const value = options[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      errorMessage ?? `Option "${key}" must be a non-empty string`,
    );
  }

  return value;
}
