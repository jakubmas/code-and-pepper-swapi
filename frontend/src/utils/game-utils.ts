export function formatAttributeValue(value: string | number, attribute?: string): string {
  const num = typeof value === 'string' ? parseInt(value) : value;
  if (isNaN(num)) return value.toString();

  // Add thousand separators for display
  const formatted = num.toLocaleString();

  // Add units if attribute is provided
  if (attribute === 'mass') return `${formatted} kg`;
  if (attribute === 'crew') return `${formatted} crew`;

  return formatted;
}
