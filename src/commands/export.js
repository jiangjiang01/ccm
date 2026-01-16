import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { readProfiles } from '../core/profiles.js';
import { success, error, info } from '../utils/logger.js';

/**
 * Export profiles to a file
 */
export async function exportCommand(file, options = {}) {
  try {
    const profiles = readProfiles();

    if (Object.keys(profiles.profiles).length === 0) {
      info('No profiles to export');
      return;
    }

    // Default file path
    const outputFile = file || './claude-profiles-backup.json';
    const outputPath = resolve(outputFile);

    // Clone profiles to avoid modifying original
    const exportData = JSON.parse(JSON.stringify(profiles));

    // Remove API keys if --no-keys flag is set
    if (options.noKeys) {
      for (const name in exportData.profiles) {
        delete exportData.profiles[name].apiKey;
      }
    }

    // Write to file
    writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

    const profileCount = Object.keys(profiles.profiles).length;
    success(`Exported ${profileCount} profile${profileCount > 1 ? 's' : ''} to ${outputPath}`);

    if (options.noKeys) {
      info('API keys were excluded from export');
    }

  } catch (err) {
    error(`Failed to export profiles: ${err.message}`);
    process.exit(1);
  }
}
