import path from 'path';
import { intro, text, confirm, outro, isCancel } from '@clack/prompts';
import { writeMarkdownFile } from '../utils/markdown.js';
import { refineVision } from '../utils/llm.js';
import { handlePersonaStep } from '../prompts/init-persona.js';
import { handleProblemSpaceStep } from '../prompts/init-problem-space.js';
import { handleValuePropositionStep } from '../prompts/init-value-proposition.js';
import { handlePrinciplesStep } from '../prompts/init-principles.js';
import { handleSolutionsStep } from '../prompts/init-solutions.js';
import fs from 'fs';
import { FileSystemError } from '../utils/errors.js';

export async function init(): Promise<symbol | void> {
  try {
    console.log('✨ Initializing ScopeFlow project...\n');

    // Check for existing .scopeflow directory
    const scopeflowDir = '.scopeflow';
    if (fs.existsSync(scopeflowDir)) {
      const shouldDelete = await confirm({
        message: 'A .scopeflow directory already exists. Would you like to delete it and start fresh?',
      });

      if (isCancel(shouldDelete)) return shouldDelete;

      if (shouldDelete) {
        // Preserve the config file if it exists
        const configPath = path.join(scopeflowDir, 'config.json');
        let configContent = null;
        if (fs.existsSync(configPath)) {
          configContent = fs.readFileSync(configPath, 'utf-8');
        }

        // Delete the directory
        fs.rmSync(scopeflowDir, { recursive: true, force: true });
        console.log('🗑️  Deleted existing .scopeflow directory');

        // Recreate the directory and restore config if it existed
        fs.mkdirSync(scopeflowDir);
        if (configContent) {
          fs.writeFileSync(configPath, configContent);
          console.log('🔧 Preserved existing configuration');
        }
      }
    }

    // Create .scopeflow directory if it doesn't exist
    if (!fs.existsSync(scopeflowDir)) {
      fs.mkdirSync(scopeflowDir);
    }

    // Run through initialization steps
    const problemSpaceResult = await handleProblemSpaceStep();
    if (isCancel(problemSpaceResult)) return problemSpaceResult;

    // Read problem space content for persona step
    const problemSpaceContent = fs.readFileSync(path.join('.scopeflow', 'problem-space.md'), 'utf-8');
    
    const personaResult = await handlePersonaStep(problemSpaceContent);
    if (isCancel(personaResult)) return personaResult;

    const valuePropositionResult = await handleValuePropositionStep();
    if (isCancel(valuePropositionResult)) return valuePropositionResult;

    const principlesResult = await handlePrinciplesStep();
    if (isCancel(principlesResult)) return principlesResult;

    const solutionsResult = await handleSolutionsStep();
    if (isCancel(solutionsResult)) return solutionsResult;

    console.log('\n✅ ScopeFlow project initialized successfully!');
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new Error(`Failed to initialize project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
