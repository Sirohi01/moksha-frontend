/**
 * Safely sets a nested value in an object using a path string like 'hero.title' or 'items[0].text'
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  const newObj = JSON.parse(JSON.stringify(obj));
  const parts = path.replace(/\]/g, '').split(/[.\[]/);
  let current = newObj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    
    // If next part is a number, current part should be an array
    if (!current[part]) {
      current[part] = isNaN(Number(nextPart)) ? {} : [];
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
  
  return newObj;
}

/**
 * Safely gets a nested value
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  const parts = path.replace(/\]/g, '').split(/[.\[]/);
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}
