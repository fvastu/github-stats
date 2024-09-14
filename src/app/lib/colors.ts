function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

function shadeColor(
  r: number,
  g: number,
  b: number,
  factor: number
): { r: number; g: number; b: number } {
  return {
    r: Math.min(255, Math.max(0, Math.floor(r * factor))),
    g: Math.min(255, Math.max(0, Math.floor(g * factor))),
    b: Math.min(255, Math.max(0, Math.floor(b * factor))),
  };
}

export function generateShades(
  hexColor: string,
  numShades: number = 10
): string[] {
  const { r, g, b } = hexToRgb(hexColor);
  const shades: string[] = [];
  const step = 1 / (numShades + 1);

  for (let i = 1; i <= numShades; i++) {
    const factor = step * i;
    const shaded = shadeColor(r, g, b, factor);
    shades.push(rgbToHex(shaded.r, shaded.g, shaded.b));
  }

  return shades;
}
