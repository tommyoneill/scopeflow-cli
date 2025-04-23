/**
 * Converts a string into a clean, URL-friendly slug
 * Examples:
 * - "DevOps Project Manager" → "devops-project-manager"
 * - "Front-end Developer" → "frontend-developer"
 * - "Product Owner (PO)" → "product-owner"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    // Remove common role indicators in parentheses
    .replace(/\s*\([^)]*\)/g, '')
    // Convert common abbreviations and special cases
    .replace(/\bdevops\b/g, 'devops')
    .replace(/\bfront[- ]end\b/g, 'frontend')
    .replace(/\bback[- ]end\b/g, 'backend')
    .replace(/\bfull[- ]stack\b/g, 'fullstack')
    // Replace any non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/(^-|-$)/g, '')
    // Remove any duplicate hyphens
    .replace(/-+/g, '-')
    // Ensure the slug isn't empty
    .trim() || 'user';
}
  