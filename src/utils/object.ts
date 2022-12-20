export function applyObject<T extends object>(
  source: T,
  target: Partial<T>,
): T {
  for (const key in target) {
    source[key] = target[key];
  }
  return source;
}
