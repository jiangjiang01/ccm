import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { getProfilesPath, resolveClaudeDir } from '../utils/paths.js';

/**
 * Profile management operations
 */

const PROFILES_VERSION = '1.0.0';

/**
 * Initialize empty profiles structure
 */
function createEmptyProfiles() {
  return {
    version: PROFILES_VERSION,
    currentProfile: null,
    profiles: {}
  };
}

/**
 * Read profiles.json
 */
export function readProfiles() {
  const profilesPath = getProfilesPath();

  if (!existsSync(profilesPath)) {
    return createEmptyProfiles();
  }

  try {
    const data = readFileSync(profilesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read profiles: ${error.message}`);
  }
}

/**
 * Write profiles.json atomically
 */
export function writeProfiles(profiles) {
  const profilesPath = getProfilesPath();
  const claudeDir = dirname(profilesPath);

  // Ensure .claude directory exists
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true, mode: 0o700 });
  }

  try {
    // Write to temp file first
    const tempPath = profilesPath + '.tmp';
    writeFileSync(tempPath, JSON.stringify(profiles, null, 2), { mode: 0o600 });

    // Backup existing file
    if (existsSync(profilesPath)) {
      const backupPath = profilesPath + '.bak';
      writeFileSync(backupPath, readFileSync(profilesPath));
    }

    // Rename temp to actual
    writeFileSync(profilesPath, readFileSync(tempPath), { mode: 0o600 });
  } catch (error) {
    throw new Error(`Failed to write profiles: ${error.message}`);
  }
}

/**
 * Get a specific profile by name
 */
export function getProfile(name) {
  const profiles = readProfiles();
  return profiles.profiles[name] || null;
}

/**
 * Get all profiles
 */
export function getAllProfiles() {
  const profiles = readProfiles();
  return profiles.profiles;
}

/**
 * Get current active profile name
 */
export function getCurrentProfileName() {
  const profiles = readProfiles();
  return profiles.currentProfile;
}

/**
 * Get current active profile
 */
export function getCurrentProfile() {
  const profiles = readProfiles();
  const currentName = profiles.currentProfile;
  return currentName ? profiles.profiles[currentName] : null;
}

/**
 * Add a new profile
 */
export function addProfile(name, apiUrl, apiKey) {
  const profiles = readProfiles();

  if (profiles.profiles[name]) {
    throw new Error(`Profile '${name}' already exists`);
  }

  profiles.profiles[name] = {
    name,
    apiUrl,
    apiKey,
    createdAt: new Date().toISOString(),
    lastUsed: null
  };

  // Set as current if it's the first profile
  if (Object.keys(profiles.profiles).length === 1) {
    profiles.currentProfile = name;
    profiles.profiles[name].lastUsed = new Date().toISOString();
  }

  writeProfiles(profiles);
  return profiles.profiles[name];
}

/**
 * Update an existing profile
 */
export function updateProfile(name, apiUrl, apiKey) {
  const profiles = readProfiles();

  if (!profiles.profiles[name]) {
    throw new Error(`Profile '${name}' does not exist`);
  }

  const existing = profiles.profiles[name];
  profiles.profiles[name] = {
    ...existing,
    apiUrl,
    apiKey
  };

  writeProfiles(profiles);
  return profiles.profiles[name];
}

/**
 * Delete a profile
 */
export function deleteProfile(name) {
  const profiles = readProfiles();

  if (!profiles.profiles[name]) {
    throw new Error(`Profile '${name}' does not exist`);
  }

  if (profiles.currentProfile === name) {
    throw new Error(`Cannot delete active profile '${name}'. Switch to another profile first.`);
  }

  delete profiles.profiles[name];
  writeProfiles(profiles);
}

/**
 * Rename a profile
 */
export function renameProfile(oldName, newName) {
  const profiles = readProfiles();

  if (!profiles.profiles[oldName]) {
    throw new Error(`Profile '${oldName}' does not exist`);
  }

  if (profiles.profiles[newName]) {
    throw new Error(`Profile '${newName}' already exists`);
  }

  profiles.profiles[newName] = {
    ...profiles.profiles[oldName],
    name: newName
  };

  delete profiles.profiles[oldName];

  // Update current profile reference if needed
  if (profiles.currentProfile === oldName) {
    profiles.currentProfile = newName;
  }

  writeProfiles(profiles);
}

/**
 * Set current active profile
 */
export function setCurrentProfile(name) {
  const profiles = readProfiles();

  if (!profiles.profiles[name]) {
    throw new Error(`Profile '${name}' does not exist`);
  }

  profiles.currentProfile = name;
  profiles.profiles[name].lastUsed = new Date().toISOString();

  writeProfiles(profiles);
}

/**
 * Check if profiles.json exists and has profiles
 */
export function hasProfiles() {
  const profiles = readProfiles();
  return Object.keys(profiles.profiles).length > 0;
}
