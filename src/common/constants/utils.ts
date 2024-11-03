export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function createRegexPattern(name: string): string {
  const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const escapedName = normalizedName.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');

  return `%${escapedName}%`;
}
