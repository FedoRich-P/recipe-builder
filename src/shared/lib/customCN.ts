type ClassValue = string | number | boolean | undefined | null;

export function customCN(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}