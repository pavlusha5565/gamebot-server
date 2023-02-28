export const timeScaleConstant = {
  s: 0,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

export function expiresInToSeconds(pointer: string): number {
  const timeScale = pointer.match(/[smhd]/)?.[0];
  const number = Number.parseInt(pointer);
  if (!timeScale || !number) {
    return 0;
  }
  return number * timeScaleConstant[timeScale];
}

export function getExpiresDate(pointer: string): Date {
  return new Date(new Date().getTime() + expiresInToSeconds(pointer) * 1000);
}
