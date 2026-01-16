import { getProfile, setCurrentProfile, getAllProfiles } from '../core/profiles.js';
import { updateApiConfig } from '../core/config.js';
import { success, error, maskApiKey, info } from '../utils/logger.js';

/**
 * Find similar profile names for suggestions
 */
function findSimilarProfiles(name, profiles) {
  const profileNames = Object.keys(profiles);
  return profileNames.filter(p =>
    p.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(p.toLowerCase())
  );
}

/**
 * Switch to a different profile
 */
export async function useCommand(name) {
  try {
    if (!name) {
      error('Profile name is required');
      info('Usage: ccm use <name>');
      process.exit(1);
    }

    // Get profile
    const profile = getProfile(name);

    if (!profile) {
      error(`Profile '${name}' does not exist`);

      // Suggest similar profiles
      const allProfiles = getAllProfiles();
      const similar = findSimilarProfiles(name, allProfiles);

      if (similar.length > 0) {
        info(`Did you mean: ${similar.join(', ')}?`);
      } else {
        info('Use "ccm list" to see available profiles');
      }

      process.exit(1);
    }

    // Update settings.json
    updateApiConfig(profile.apiUrl, profile.apiKey);

    // Update current profile in profiles.json
    setCurrentProfile(name);

    success(`Switched to profile '${name}'`);
    console.log(`  API URL: ${profile.apiUrl}`);
    console.log(`  API Key: ${maskApiKey(profile.apiKey)}`);
    console.log();

  } catch (err) {
    error(`Failed to switch profile: ${err.message}`);
    process.exit(1);
  }
}
