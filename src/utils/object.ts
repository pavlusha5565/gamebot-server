export function applyObject<T extends object>(source: T, data: Partial<T>): T {
  for (const key in data) {
    source[key] = data[key];
  }
  return source;
}

export function parseJwt<T>(token: string): T {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
