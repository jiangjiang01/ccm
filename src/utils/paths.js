import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { execSync } from 'child_process';

/**
 * Resolves the .claude directory path with fallback strategy
 * Priority: current dir -> git root -> home dir -> env variable
 */
export function resolveClaudeDir() {
  // 1. Check environment variable first
  if (process.env.CLAUDE_CONFIG_DIR) {
    const envPath = process.env.CLAUDE_CONFIG_DIR;
    if (existsSync(envPath)) {
      return envPath;
    }
  }

  // 2. Check current working directory
  const cwdPath = join(process.cwd(), '.claude');
  if (existsSync(cwdPath)) {
    return cwdPath;
  }

  // 3. Check git root directory
  try {
    const gitRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    const gitPath = join(gitRoot, '.claude');
    if (existsSync(gitPath)) {
      return gitPath;
    }
  } catch (error) {
    // Not in a git repo or git not available, continue to next fallback
  }

  // 4. Check home directory
  const homePath = join(homedir(), '.claude');
  if (existsSync(homePath)) {
    return homePath;
  }

  // 5. Default to current working directory (will be created if needed)
  return cwdPath;
}

/**
 * Get the settings.json file path
 */
export function getSettingsPath() {
  return join(resolveClaudeDir(), 'settings.json');
}

/**
 * Get the profiles.json file path
 */
export function getProfilesPath() {
  return join(resolveClaudeDir(), 'profiles.json');
}

/**
 * Check if .claude directory exists
 */
export function claudeDirExists() {
  return existsSync(resolveClaudeDir());
}

/**
 * Check if settings.json exists
 */
export function settingsExists() {
  return existsSync(getSettingsPath());
}

/**
 * Check if profiles.json exists
 */
export function profilesExists() {
  return existsSync(getProfilesPath());
}
