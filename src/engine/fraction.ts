/**
 * NovaMath Lab — Fraction Arithmetic Utility
 * Ensures fractions are consistently simplified, parsed, and displayed.
 */

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export class Fraction {
  readonly num: number;
  readonly den: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) {
      throw new Error('Denominator cannot be zero');
    }
    num = Math.round(num);
    den = Math.round(den);

    if (den < 0) {
      num = -num;
      den = -den;
    }

    const d = gcd(num, den);
    this.num = num / d;
    this.den = den / d;
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    if (other.num === 0) {
      throw new Error('Division by zero fraction');
    }
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  equals(other: Fraction): boolean {
    return this.num === other.num && this.den === other.den;
  }

  toDecimal(): number {
    return this.num / this.den;
  }

  toString(): string {
    if (this.den === 1) {
      return `${this.num}`;
    }
    return `${this.num}/${this.den}`;
  }

  toMixedString(): string {
    if (this.den === 1) return `${this.num}`;
    const sign = this.num < 0 ? '-' : '';
    const absNum = Math.abs(this.num);
    const whole = Math.floor(absNum / this.den);
    const rem = absNum % this.den;

    if (whole === 0) {
      return `${sign}${rem}/${this.den}`;
    }
    if (rem === 0) {
      return `${sign}${whole}`;
    }
    return `${sign}${whole} ${rem}/${this.den}`;
  }

  static parse(str: string): Fraction | null {
    if (!str || typeof str !== 'string') return null;
    const clean = str.trim();

    // Check mixed fraction e.g. "2 1/2" or "-1 3/4"
    const mixedMatch = clean.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1], 10);
      const num = parseInt(mixedMatch[2], 10);
      const den = parseInt(mixedMatch[3], 10);
      if (den === 0) return null;
      const sign = whole < 0 ? -1 : 1;
      return new Fraction(whole * den + sign * num, den);
    }

    // Check simple fraction e.g. "3/4" or "-5/8"
    const fracMatch = clean.match(/^(-?\d+)\/(\d+)$/);
    if (fracMatch) {
      const num = parseInt(fracMatch[1], 10);
      const den = parseInt(fracMatch[2], 10);
      if (den === 0) return null;
      return new Fraction(num, den);
    }

    // Check single integer e.g. "5" or "-3"
    const intMatch = clean.match(/^(-?\d+)$/);
    if (intMatch) {
      return new Fraction(parseInt(intMatch[1], 10), 1);
    }

    // Check a complete decimal value e.g. "2.5" -> 5/2.
    // Do not accept numeric prefixes from malformed input such as "2.5oops".
    if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(clean)) {
      const dec = Number(clean);
      // Find fractional representation
      const precision = 10000;
      return new Fraction(Math.round(dec * precision), precision);
    }

    return null;
  }
}
