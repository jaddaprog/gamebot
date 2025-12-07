/**
 * Utils package entry point
 */

export function formatMessage(message: string): string {
  return `[GAMEBOT] ${message}`;
}

export function getCurrentTimestamp(): number {
  return Date.now();
}
