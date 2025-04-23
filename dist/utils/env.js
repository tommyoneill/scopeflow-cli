import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigError } from './errors.js';
const CONFIG_DIR = path.join(os.homedir(), '.scopeflow');
const ENV_FILE = path.join(CONFIG_DIR, '.env');
export function loadEnvConfig() {
    try {
        // Try to load from environment first
        if (process.env.OPENAI_API_KEY) {
            return { OPENAI_API_KEY: process.env.OPENAI_API_KEY };
        }
        // Try to load from .env file
        if (fs.existsSync(ENV_FILE)) {
            const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
            const apiKey = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1];
            if (apiKey) {
                process.env.OPENAI_API_KEY = apiKey;
                return { OPENAI_API_KEY: apiKey };
            }
        }
        throw new ConfigError('OpenAI API key not found. Please run: scopeflow config');
    }
    catch (error) {
        if (error instanceof ConfigError) {
            throw error;
        }
        throw new ConfigError(`Failed to load environment config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export function saveEnvConfig(config) {
    try {
        // Ensure config directory exists
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 }); // Read/write/execute for owner only
        }
        // Save to .env file
        const envContent = `OPENAI_API_KEY=${config.OPENAI_API_KEY}\n`;
        fs.writeFileSync(ENV_FILE, envContent, { mode: 0o600 }); // Read/write for owner only
        // Also set in current process
        process.env.OPENAI_API_KEY = config.OPENAI_API_KEY;
    }
    catch (error) {
        throw new ConfigError(`Failed to save environment config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=env.js.map