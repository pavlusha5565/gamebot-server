export function applyObject<T extends object>(source: T, data: Partial<T>): T {
  for (const key in data) {
    source[key] = data[key];
  }
  return source;
}
