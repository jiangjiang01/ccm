import chalk from 'chalk';

/**
 * Logger utility with colored output
 */

export function success(message) {
  console.log(chalk.green('✓'), message);
}

export function error(message) {
  console.log(chalk.red('✗'), message);
}

export function warning(message) {
  console.log(chalk.yellow('⚠'), message);
}

export function info(message) {
  console.log(chalk.blue('ℹ'), message);
}

export function log(message) {
  console.log(message);
}

export function header(message) {
  console.log(chalk.bold.blue(message));
}

export function dim(message) {
  return chalk.dim(message);
}

export function bold(message) {
  return chalk.bold(message);
}

/**
 * Mask API key to show only last 4 characters
 */
export function maskApiKey(key) {
  if (!key || key.length <= 4) {
    return '****';
  }
  return '****' + key.slice(-4);
}

/**
 * Format profile name with active indicator
 */
export function formatProfileName(name, isActive = false) {
  if (isActive) {
    return chalk.green('✓ ' + name);
  }
  return '  ' + name;
}

/**
 * Print a section header with padding
 */
export function section(title) {
  console.log();
  console.log(chalk.bold.blue(title));
  console.log();
}
