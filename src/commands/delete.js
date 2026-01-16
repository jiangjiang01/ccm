import inquirer from 'inquirer';
import { deleteProfile, getProfile } from '../core/profiles.js';
import { success, error, info } from '../utils/logger.js';

/**
 * Delete a profile
 */
export async function deleteCommand(name, options = {}) {
  try {
    if (!name) {
      error('Profile name is required');
      info('Usage: ccm delete <name>');
      process.exit(1);
    }

    // Check if profile exists
    const profile = getProfile(name);
    if (!profile) {
      error(`Profile '${name}' does not exist`);
      info('Use "ccm list" to see available profiles');
      process.exit(1);
    }

    // Confirmation prompt unless --force flag is used
    if (!options.force) {
      const { confirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Delete profile '${name}'? This cannot be undone.`,
          default: false
        }
      ]);

      if (!confirmed) {
        info('Deletion cancelled');
        return;
      }
    }

    // Delete profile (this will throw if it's the current profile)
    deleteProfile(name);

    success(`Profile '${name}' deleted`);

  } catch (err) {
    error(`Failed to delete profile: ${err.message}`);
    process.exit(1);
  }
}
