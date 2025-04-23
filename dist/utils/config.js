import fs from 'fs';
import path from 'path';
import os from 'os';
import { select } from './prompts.js';
import { ConfigError, FileSystemError, SecurityError } from './errors.js';
import { validateEditor, validateConfigPath, setSecureFilePermissions, setSecureDirectoryPermissions } from './security.js';
const CONFIG_DIR = path.join(os.homedir(), '.scopeflow');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const DEFAULT_EDITORS = [
    { value: 'code', label: 'Visual Studio Code' },
    { value: 'cursor', label: 'Cursor' },
    { value: 'nano', label: 'Nano' },
    { value: 'vim', label: 'Vim' },
    { value: 'emacs', label: 'Emacs' }
];
export async function getConfig() {
    try {
        // Validate config paths
        validateConfigPath(CONFIG_DIR);
        validateConfigPath(CONFIG_FILE);
        // Ensure config directory exists with secure permissions
        try {
            if (!fs.existsSync(CONFIG_DIR)) {
                fs.mkdirSync(CONFIG_DIR, { recursive: true });
                setSecureDirectoryPermissions(CONFIG_DIR);
            }
        }
        catch (error) {
            throw new FileSystemError(`Failed to create config directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        // Read existing config if it exists
        if (fs.existsSync(CONFIG_FILE)) {
            try {
                const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
                if (!config.editor) {
                    throw new ConfigError('Invalid config format: editor field is missing');
                }
                validateEditor(config.editor);
                return config;
            }
            catch (error) {
                if (error instanceof ConfigError || error instanceof SecurityError) {
                    throw error;
                }
                if (error instanceof SyntaxError) {
                    throw new ConfigError('Invalid config file format: JSON parse error');
                }
                throw new FileSystemError(`Failed to read config file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Create new config
        try {
            const editor = await select({
                message: 'Select your preferred text editor:',
                options: DEFAULT_EDITORS
            });
            validateEditor(editor);
            const config = { editor };
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
            setSecureFilePermissions(CONFIG_FILE);
            return config;
        }
        catch (error) {
            throw new ConfigError(`Failed to create new config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    catch (error) {
        if (error instanceof ConfigError || error instanceof FileSystemError || error instanceof SecurityError) {
            throw error;
        }
        throw new ConfigError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=config.js.map