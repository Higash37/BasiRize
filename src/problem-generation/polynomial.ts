export function quadratic(b: number, c: number): string {
  let text = "x²";

  if (b !== 0) {
    text += b > 0 ? " + " : " - ";
    const size = Math.abs(b);
    text += size === 1 ? "x" : `${size}x`;
  }

  if (c !== 0) {
    text += c > 0 ? " + " : " - ";
    text += Math.abs(c);
  }

  return text;
}

export function factor(value: number): string {
  return value > 0 ? `(x + ${value})` : `(x - ${Math.abs(value)})`;
}

export function withVariable(coefficient: number, variable: string): string {
  if (coefficient === 1) {
    return variable;
  }
  if (coefficient === -1) {
    return `-${variable}`;
  }
  return `${coefficient}${variable}`;
}

export function signedTerm(coefficient: number, variable: string): string {
  const sign = coefficient > 0 ? " + " : " - ";
  const size = Math.abs(coefficient);

  if (variable.length === 0) {
    return `${sign}${size}`;
  }
  return `${sign}${size === 1 ? variable : `${size}${variable}`}`;
}
