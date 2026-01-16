import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { readProfiles, writeProfiles } from '../core/profiles.js';
import { success, error, warning, info } from '../utils/logger.js';

/**
 * Import profiles from a file
 */
export async function importCommand(file, options = {}) {
  try {
    if (!file) {
      error('Import file path is required');
      info('Usage: ccm import <file>');
      process.exit(1);
    }

    const inputPath = resolve(file);

    // Check if file exists
    if (!existsSync(inputPath)) {
      error(`File not found: ${inputPath}`);
      process.exit(1);
    }

    // Read and parse import file
    let importData;
    try {
      const fileContent = readFileSync(inputPath, 'utf-8');
      importData = JSON.parse(fileContent);
    } catch (err) {
      error(`Failed to parse import file: ${err.message}`);
      process.exit(1);
    }

    // Validate import data structure
    if (!importData.profiles || typeof importData.profiles !== 'object') {
      error('Invalid import file format: missing profiles object');
      process.exit(1);
    }

    // Get current profiles
    const currentProfiles = readProfiles();

    let imported = 0;
    let skipped = 0;
    const conflicts = [];

    // Import profiles
    for (const [name, profile] of Object.entries(importData.profiles)) {
      // Check for conflicts
      if (currentProfiles.profiles[name] && !options.merge) {
        conflicts.push(name);
        skipped++;
        continue;
      }

      // Validate required fields
      if (!profile.apiUrl || !profile.apiKey) {
        warning(`Skipping profile '${name}': missing apiUrl or apiKey`);
        skipped++;
        continue;
      }

      // Add profile
      currentProfiles.profiles[name] = {
        name,
        apiUrl: profile.apiUrl,
        apiKey: profile.apiKey,
        createdAt: profile.createdAt || new Date().toISOString(),
        lastUsed: profile.lastUsed || null
      };

      imported++;
    }

    // Write updated profiles
    writeProfiles(currentProfiles);

    // Report results
    info(`Importing profiles from ${inputPath}...`);
    console.log();

    if (imported > 0) {
      success(`${imported} profile${imported > 1 ? 's' : ''} imported`);
    }

    if (conflicts.length > 0) {
      warning(`${conflicts.length} profile${conflicts.length > 1 ? 's' : ''} skipped (name conflict: ${conflicts.join(', ')})`);
      info('Use --merge flag to overwrite existing profiles');
    }

    console.log();
    info('Use "ccm list" to see all profiles');

  } catch (err) {
    error(`Failed to import profiles: ${err.message}`);
    process.exit(1);
  }
}
