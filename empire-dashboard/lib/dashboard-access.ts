import 'server-only';

export function isDashboardReadOnly(): boolean {
  return true;
}

export function getReadOnlyErrorMessage(): string {
  return 'Dashboard is in read-only mode. Mutations are disabled.';
}
