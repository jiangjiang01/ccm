# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-01-16

### Changed
- **Settings.json Structure**: Updated to work with actual Claude Code settings format
  - Now updates `env.ANTHROPIC_BASE_URL` and `env.ANTHROPIC_AUTH_TOKEN` fields
  - Previously was updating top-level `apiUrl` and `apiKey` fields (incorrect)
  - Preserves other settings like `enabledPlugins`

- **API Key Validation**: Removed the requirement for API keys to start with `sk-ant-`
  - Old rule: Must start with `sk-ant-`, minimum 20 characters
  - New rule: Minimum 10 characters, any format accepted
  - This change allows the tool to work with various API providers and custom endpoints

### Technical Details
- Updated `src/core/config.js`:
  - `getApiConfig()` - reads from `env.ANTHROPIC_BASE_URL` and `env.ANTHROPIC_AUTH_TOKEN`
  - `updateApiConfig()` - updates nested env fields while preserving other settings
  - `createSettings()` - creates proper settings structure
- Updated `src/core/validator.js` - `validateApiKey()` function
- Updated documentation: DESIGN_SPEC.md, README.md, IMPLEMENTATION.md

---

## [1.0.0] - 2026-01-16

### Added
- Initial release of Claude Config Manager (CCM)
- 10 core commands: init, list, show, add, use, set, delete, rename, export, import
- Interactive mode support for add/set commands
- Colored terminal output with status indicators
- Secure file handling with 0600 permissions
- API key masking in all output
- Profile import/export functionality
- Automatic backup on file modifications
- Smart profile name suggestions
- Confirmation prompts for destructive operations

### Features
- Profile management with CRUD operations
- Configuration file management (profiles.json + settings.json)
- Path resolution with multiple fallback strategies
- Input validation for names, URLs, and API keys
- Atomic file writes for data safety
