import { text, isCancel } from '@clack/prompts';
import { saveEnvConfig } from '../utils/env.js';
import { ConfigError } from '../utils/errors.js';
export async function config() {
    try {
        console.log('🔑 Setting up your OpenAI API key...\n');
        const apiKey = await text({
            message: 'Enter your OpenAI API key:',
            placeholder: 'sk-...',
        });
        if (isCancel(apiKey)) {
            return apiKey;
        }
        if (!apiKey || typeof apiKey !== 'string') {
            throw new ConfigError('No API key provided');
        }
        // Validate API key format
        if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
            throw new ConfigError('Invalid API key format. It should start with "sk-" and be at least 20 characters long.');
        }
        saveEnvConfig({ OPENAI_API_KEY: apiKey });
        console.log('\n✅ API key saved successfully!');
        console.log('\nYou can now run:');
        console.log('  scopeflow init');
    }
    catch (error) {
        if (error instanceof ConfigError) {
            console.error('\n❌ Error:', error.message);
            process.exit(1);
        }
        console.error('\n❌ Error:', error instanceof Error ? error.message : 'An unknown error occurred');
        process.exit(1);
    }
}
//# sourceMappingURL=config.js.map