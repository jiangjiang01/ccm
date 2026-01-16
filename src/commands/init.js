import { readSettings, createSettings, settingsFileExists } from '../core/config.js';
import { addProfile, hasProfiles, writeProfiles } from '../core/profiles.js';
import { success, error, warning, info, section } from '../utils/logger.js';
import { resolveClaudeDir, claudeDirExists } from '../utils/paths.js';
import { mkdirSync } from 'fs';

/**
 * Initialize profile management
 */
export async function initCommand() {
  try {
    section('Initializing Claude Config Manager...');

    // Ensure .claude directory exists
    const claudeDir = resolveClaudeDir();
    if (!claudeDirExists()) {
      mkdirSync(claudeDir, { recursive: true, mode: 0o700 });
      success(`Created directory: ${claudeDir}`);
    }

    // Check if profiles already exist
    if (hasProfiles()) {
      warning('Profile management is already initialized');
      info('Use "ccm list" to see existing profiles');
      return;
    }

    // Check if settings.json exists
    const settings = readSettings();

    if (settings && settings.apiUrl && settings.apiKey) {
      // Import existing settings as default profile
      addProfile('default', settings.apiUrl, settings.apiKey);
      success('Found existing settings.json');
      success('Imported current config as "default" profile');
    } else {
      // Create empty profiles structure
      writeProfiles({
        version: '1.0.0',
        currentProfile: null,
        profiles: {}
      });
      success('Initialized empty profile storage');
      info('Use "ccm add <name> <url> <key>" to create your first profile');
    }

    console.log();
    info('Profile management is ready!');
    info('Run "ccm --help" to see available commands');

  } catch (err) {
    error(`Initialization failed: ${err.message}`);
    process.exit(1);
  }
}
