import { getCurrentProfile, getCurrentProfileName } from '../core/profiles.js';
import { section, error, info, maskApiKey } from '../utils/logger.js';

/**
 * Show current active profile
 */
export async function showCommand() {
  try {
    const currentName = getCurrentProfileName();
    const currentProfile = getCurrentProfile();

    if (!currentProfile) {
      info('No active profile. Use "ccm use <name>" to activate a profile.');
      return;
    }

    section(`Current profile: ${currentName}`);

    console.log(`  API URL:    ${currentProfile.apiUrl}`);
    console.log(`  API Key:    ${maskApiKey(currentProfile.apiKey)}`);
    console.log(`  Created:    ${new Date(currentProfile.createdAt).toLocaleString()}`);

    if (currentProfile.lastUsed) {
      console.log(`  Last used:  ${new Date(currentProfile.lastUsed).toLocaleString()}`);
    }

    console.log();

  } catch (err) {
    error(`Failed to show profile: ${err.message}`);
    process.exit(1);
  }
}
