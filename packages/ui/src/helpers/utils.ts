export function capitalizeFirstWord(value: string): string {
  return value.replace(/^(\s*\S)/, (match) => match.toUpperCase());
}
