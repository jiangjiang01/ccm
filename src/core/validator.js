/**
 * Input validation utilities
 */

/**
 * Validate profile name
 * Rules: 1-50 chars, alphanumeric, dash, underscore only
 */
export function validateProfileName(name) {
  if (!name) {
    return { valid: false, error: 'Profile name is required' };
  }

  if (typeof name !== 'string') {
    return { valid: false, error: 'Profile name must be a string' };
  }

  if (name.length < 1 || name.length > 50) {
    return { valid: false, error: 'Profile name must be 1-50 characters' };
  }

  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(name)) {
    return { valid: false, error: 'Profile name can only contain letters, numbers, dashes, and underscores' };
  }

  return { valid: true };
}

/**
 * Validate API URL
 * Rules: Valid HTTPS URL format
 */
export function validateApiUrl(url) {
  if (!url) {
    return { valid: false, error: 'API URL is required' };
  }

  if (typeof url !== 'string') {
    return { valid: false, error: 'API URL must be a string' };
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, error: 'API URL must use HTTPS or HTTP protocol' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate API key
 * Rules: Non-empty string, minimum 10 chars
 */
export function validateApiKey(key) {
  if (!key) {
    return { valid: false, error: 'API key is required' };
  }

  if (typeof key !== 'string') {
    return { valid: false, error: 'API key must be a string' };
  }

  if (key.length < 10) {
    return { valid: false, error: 'API key must be at least 10 characters' };
  }

  return { valid: true };
}

/**
 * Validate all profile inputs at once
 */
export function validateProfile(name, url, key) {
  const nameValidation = validateProfileName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const urlValidation = validateApiUrl(url);
  if (!urlValidation.valid) {
    return urlValidation;
  }

  const keyValidation = validateApiKey(key);
  if (!keyValidation.valid) {
    return keyValidation;
  }

  return { valid: true };
}
