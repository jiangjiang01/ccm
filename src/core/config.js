import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { getSettingsPath, resolveClaudeDir } from '../utils/paths.js';

/**
 * Config file (settings.json) operations
 */

/**
 * Read settings.json
 */
export function readSettings() {
  const settingsPath = getSettingsPath();

  if (!existsSync(settingsPath)) {
    return null;
  }

  try {
    const data = readFileSync(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read settings: ${error.message}`);
  }
}

/**
 * Write settings.json atomically
 */
export function writeSettings(settings) {
  const settingsPath = getSettingsPath();
  const claudeDir = dirname(settingsPath);

  // Ensure .claude directory exists
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true, mode: 0o700 });
  }

  try {
    // Write to temp file first
    const tempPath = settingsPath + '.tmp';
    writeFileSync(tempPath, JSON.stringify(settings, null, 2), 'utf-8');

    // Backup existing file
    if (existsSync(settingsPath)) {
      const backupPath = settingsPath + '.bak';
      writeFileSync(backupPath, readFileSync(settingsPath));
    }

    // Rename temp to actual
    writeFileSync(settingsPath, readFileSync(tempPath), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write settings: ${error.message}`);
  }
}

/**
 * Update specific fields in settings.json
 */
export function updateSettings(updates) {
  const settings = readSettings() || {};
  const merged = { ...settings, ...updates };
  writeSettings(merged);
  return merged;
}

/**
 * Get API configuration from settings
 */
export function getApiConfig() {
  const settings = readSettings();
  if (!settings) {
    return null;
  }

  return {
    apiUrl: settings.env?.ANTHROPIC_BASE_URL || '',
    apiKey: settings.env?.ANTHROPIC_AUTH_TOKEN || ''
  };
}

/**
 * Update API configuration in settings
 */
export function updateApiConfig(apiUrl, apiKey) {
  const settings = readSettings() || {};

  // Ensure env object exists
  if (!settings.env) {
    settings.env = {};
  }

  // Update env fields
  settings.env.ANTHROPIC_BASE_URL = apiUrl;
  settings.env.ANTHROPIC_AUTH_TOKEN = apiKey;

  writeSettings(settings);
  return settings;
}

/**
 * Check if settings.json exists
 */
export function settingsFileExists() {
  return existsSync(getSettingsPath());
}

/**
 * Create initial settings.json with profile data
 */
export function createSettings(apiUrl, apiKey) {
  const settings = {
    env: {
      ANTHROPIC_AUTH_TOKEN: apiKey,
      ANTHROPIC_BASE_URL: apiUrl
    },
    enabledPlugins: {},
    apiUrl: "",
    apiKey: ""
  };
  writeSettings(settings);
  return settings;
}
