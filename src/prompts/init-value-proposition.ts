import { text, confirm } from '@clack/prompts';
import { refineValueProposition } from '../utils/llm.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { FileSystemError } from '../utils/errors.js';

export async function handleValuePropositionStep(): Promise<void> {
  try {
    console.log('\n💎 Now, let\'s define your value proposition...');
    
    const rawValueProp = await text({
      message: 'What value does your solution provide?',
      placeholder: 'Describe your value proposition...',
    });

    if (!rawValueProp || typeof rawValueProp !== 'string') {
      throw new Error('No input provided for value proposition');
    }

    console.log('\n✨ Refining your input with AI...');
    const refinedValueProp = await refineValueProposition(rawValueProp);

    console.log('\n💡 Suggested Value Proposition:\n');
    console.log(refinedValueProp);

    const accept = await confirm({
      message: 'Use this version?',
    });

    const finalValueProp = accept ? refinedValueProp : rawValueProp;

    const filePath = '.scopeflow/value-proposition.md';
    writeMarkdownFile({
      filePath,
      frontmatter: {
        title: 'Value Proposition',
        createdAt: new Date().toISOString(),
        type: 'value-proposition',
      },
      content: finalValueProp,
    });

    console.log(`\n✅ Saved to ${filePath}`);
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new Error(`Failed to handle value proposition step: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 