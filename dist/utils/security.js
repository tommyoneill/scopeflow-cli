import fs from 'fs';
import os from 'os';
import { SecurityError } from './errors.js';
const ALLOWED_EDITORS = ['code', 'cursor', 'nano', 'vim', 'emacs'];
const CONFIG_FILE_PERMISSIONS = 0o600; // Read/write for owner only
const CONFIG_DIR_PERMISSIONS = 0o700; // Read/write/execute for owner only
export function validateEditor(editor) {
    if (!ALLOWED_EDITORS.includes(editor)) {
        throw new SecurityError(`Invalid editor: ${editor}`);
    }
}
export function validateConfigPath(path) {
    if (!path.startsWith(process.env.HOME || os.homedir())) {
        throw new SecurityError('Config path must be within user home directory');
    }
}
export function setSecureFilePermissions(filePath) {
    try {
        fs.chmodSync(filePath, CONFIG_FILE_PERMISSIONS);
    }
    catch (error) {
        throw new SecurityError(`Failed to set secure permissions for ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export function setSecureDirectoryPermissions(dirPath) {
    try {
        fs.chmodSync(dirPath, CONFIG_DIR_PERMISSIONS);
    }
    catch (error) {
        throw new SecurityError(`Failed to set secure permissions for directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export function sanitizeFilename(filename) {
    // Remove any path traversal attempts and special characters
    return filename.replace(/[^a-zA-Z0-9-_.]/g, '_');
}
//# sourceMappingURL=security.js.map