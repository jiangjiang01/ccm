import { getAllProfiles, getCurrentProfileName } from '../core/profiles.js';
import { section, formatProfileName, maskApiKey, dim, info } from '../utils/logger.js';

/**
 * List all profiles
 */
export async function listCommand() {
  try {
    const profiles = getAllProfiles();
    const currentProfile = getCurrentProfileName();

    if (Object.keys(profiles).length === 0) {
      info('No profiles found. Use "ccm add <name> <url> <key>" to create one.');
      return;
    }

    section('Available profiles:');

    // Sort profiles: current first, then by last used, then alphabetically
    const sortedEntries = Object.entries(profiles).sort(([nameA, profA], [nameB, profB]) => {
      if (nameA === currentProfile) return -1;
      if (nameB === currentProfile) return 1;

      if (profA.lastUsed && !profB.lastUsed) return -1;
      if (!profA.lastUsed && profB.lastUsed) return 1;

      if (profA.lastUsed && profB.lastUsed) {
        return new Date(profB.lastUsed) - new Date(profA.lastUsed);
      }

      return nameA.localeCompare(nameB);
    });

    // Calculate max name length for alignment
    const maxNameLength = Math.max(...sortedEntries.map(([name]) => name.length));
    const padding = maxNameLength + 4;

    for (const [name, profile] of sortedEntries) {
      const isActive = name === currentProfile;
      const displayName = formatProfileName(name, isActive);
      const paddedName = displayName + ' '.repeat(padding - name.length);
      const maskedKey = maskApiKey(profile.apiKey);
      const activeTag = isActive ? '(active)' : '';

      console.log(`${paddedName} ${profile.apiUrl.padEnd(40)} ${dim(maskedKey)} ${activeTag}`);
    }

    console.log();
    info('Use "ccm use <name>" to switch profiles');

  } catch (err) {
    console.error(`Failed to list profiles: ${err.message}`);
    process.exit(1);
  }
}
