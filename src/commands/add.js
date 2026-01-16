import inquirer from 'inquirer';
import { addProfile } from '../core/profiles.js';
import { updateApiConfig } from '../core/config.js';
import { validateProfile } from '../core/validator.js';
import { success, error, maskApiKey } from '../utils/logger.js';

/**
 * Add a new profile
 */
export async function addCommand(name, url, key, options = {}) {
  try {
    // Interactive mode if arguments not provided
    if (!name || !url || !key) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Profile name:',
          default: name,
          validate: (input) => {
            const result = validateProfile(input, 'https://example.com', 'sk-ant-12345678901234567890');
            if (!result.valid && result.error.includes('name')) {
              return result.error;
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'url',
          message: 'API URL:',
          default: url || 'https://api.anthropic.com',
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
          message: 'API Key:',
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

    // Validate inputs
    const validation = validateProfile(name, url, key);
    if (!validation.valid) {
      error(validation.error);
      process.exit(1);
    }

    // Add profile
    const profile = addProfile(name, url, key);

    success(`Profile '${name}' added successfully`);
    console.log(`  API URL: ${url}`);
    console.log(`  API Key: ${maskApiKey(key)}`);
    console.log();

    // Ask if user wants to switch to this profile
    if (!options.noSwitch) {
      const { shouldSwitch } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldSwitch',
          message: 'Switch to this profile now?',
          default: false
        }
      ]);

      if (shouldSwitch) {
        updateApiConfig(url, key);
        success(`Switched to profile '${name}'`);
      }
    }

  } catch (err) {
    error(`Failed to add profile: ${err.message}`);
    process.exit(1);
  }
}
