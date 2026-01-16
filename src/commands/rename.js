import { renameProfile, getProfile } from '../core/profiles.js';
import { validateProfileName } from '../core/validator.js';
import { success, error, info } from '../utils/logger.js';

/**
 * Rename a profile
 */
export async function renameCommand(oldName, newName) {
  try {
    if (!oldName || !newName) {
      error('Both old and new profile names are required');
      info('Usage: ccm rename <old-name> <new-name>');
      process.exit(1);
    }

    // Check if old profile exists
    const profile = getProfile(oldName);
    if (!profile) {
      error(`Profile '${oldName}' does not exist`);
      info('Use "ccm list" to see available profiles');
      process.exit(1);
    }

    // Validate new name
    const validation = validateProfileName(newName);
    if (!validation.valid) {
      error(validation.error);
      process.exit(1);
    }

    // Rename profile
    renameProfile(oldName, newName);

    success(`Profile renamed: '${oldName}' → '${newName}'`);

  } catch (err) {
    error(`Failed to rename profile: ${err.message}`);
    process.exit(1);
  }
}
