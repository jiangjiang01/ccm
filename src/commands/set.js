import inquirer from 'inquirer';
import { getProfile, updateProfile, getCurrentProfileName } from '../core/profiles.js';
import { updateApiConfig } from '../core/config.js';
import { validateProfile } from '../core/validator.js';
import { success, error, warning, maskApiKey, info } from '../utils/logger.js';

/**
 * Update an existing profile
 */
export async function setCommand(name, url, key) {
  try {
    // Interactive mode if arguments not provided
    if (!name || !url || !key) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Profile name to update:',
          default: name,
          validate: (input) => input ? true : 'Profile name is required'
        },
        {
          type: 'input',
          name: 'url',
          message: 'New API URL:',
          default: url,
          validate: (input) => {
            const result = validateProfile('default', input, 'sk-ant-12345678901234567890');
            if (!result.valid && result.error.includes('URL')) {
              return result.error;
            }
            return true;
          }
        },
        {
          type: 'password',
          name: 'key',
          message: 'New API Key:',
          mask: '*',
          default: key,
          validate: (input) => {
            const result = validateProfile('default', 'https://api.anthropic.com', input);
            if (!result.valid && result.error.includes('key')) {
              return result.error;
            }
            return true;
          }
        }
      ]);

      name = answers.name;
      url = answers.url;
      key = answers.key;
    }

    // Check if profile exists
    const existing = getProfile(name);
    if (!existing) {
      error(`Profile '${name}' does not exist`);
      info('Use "ccm add" to create a new profile');
      process.exit(1);
    }

    // Validate inputs
    const validation = validateProfile(name, url, key);
    if (!validation.valid) {
      error(validation.error);
      process.exit(1);
    }

    // Update profile
    updateProfile(name, url, key);

    success(`Profile '${name}' updated successfully`);
    console.log(`  API URL: ${url}`);
    console.log(`  API Key: ${maskApiKey(key)}`);
    console.log();

    // If this is the current profile, update settings.json
    const currentProfile = getCurrentProfileName();
    if (currentProfile === name) {
      updateApiConfig(url, key);
      warning('This profile is currently active. Changes applied to settings.json');
    }

  } catch (err) {
    error(`Failed to update profile: ${err.message}`);
    process.exit(1);
  }
}
