import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { confirm } from './prompts.js';
import { getConfig } from './config.js';
/**
 * Opens content in the user's editor and returns the edited content
 */
export async function editContent(content, title) {
    // Create a temporary file with the content
    const tempDir = path.join(os.tmpdir(), 'scopeflow');
    fs.mkdirSync(tempDir, { recursive: true });
    const tempFile = path.join(tempDir, `${title.toLowerCase().replace(/\s+/g, '-')}.md`);
    fs.writeFileSync(tempFile, content);
    try {
        // Get the configured editor
        const config = await getConfig();
        const editor = config.editor;
        // For GUI editors, we need to wait for the process to complete
        const isGuiEditor = ['code', 'cursor'].includes(editor);
        // Open the file in the user's editor
        const subprocess = execa(editor, [tempFile], {
            stdio: 'inherit',
            preferLocal: false,
            // For GUI editors, we need to wait for the process to complete
            detached: isGuiEditor,
        });
        if (isGuiEditor) {
            // For GUI editors, we need to wait for the process to complete
            await subprocess;
        }
        else {
            // For terminal editors, we can just wait for the process to exit
            await subprocess;
        }
        // Read the edited content
        const editedContent = fs.readFileSync(tempFile, 'utf-8');
        // For GUI editors, we need to confirm the changes were saved
        if (isGuiEditor) {
            const changesSaved = await confirm({
                message: 'Did you save your changes in the editor?',
            });
            if (!changesSaved) {
                console.log('❌ Please save your changes in the editor first.');
                return null;
            }
        }
        // Ask if the user is done editing
        const isDone = await confirm({
            message: 'Are you done editing?',
        });
        if (!isDone) {
            // If not done, recursively call editContent again
            return editContent(editedContent, title);
        }
        return editedContent;
    }
    catch (error) {
        console.error('Failed to open editor:', error);
        return null;
    }
    finally {
        // Clean up the temporary file
        try {
            fs.unlinkSync(tempFile);
        }
        catch (error) {
            // Ignore cleanup errors
        }
    }
}
//# sourceMappingURL=editor.js.map