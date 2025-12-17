// Generate UUID v4
export function generateId(): string {
  return crypto.randomUUID();
}

// Get current ISO8601 timestamp
export function now(): string {
  return new Date().toISOString();
}
