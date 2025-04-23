import { text, confirm } from '@clack/prompts';
import { refinePrinciples } from '../utils/llm.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { FileSystemError } from '../utils/errors.js';

export async function handlePrinciplesStep(): Promise<void> {
  try {
    console.log('\n✨ Next, let\'s establish your product principles...');
    
    const rawPrinciples = await text({
      message: 'What principles guide your product development?',
      placeholder: 'List your product principles...',
    });

    if (!rawPrinciples || typeof rawPrinciples !== 'string') {
      throw new Error('No input provided for principles');
    }

    console.log('\n✨ Refining your input with AI...');
    const refinedPrinciples = await refinePrinciples(rawPrinciples);

    console.log('\n💡 Suggested Product Principles:\n');
    console.log(refinedPrinciples);

    const accept = await confirm({
      message: 'Use this version?',
    });

    const finalPrinciples = accept ? refinedPrinciples : rawPrinciples;

    const filePath = '.scopeflow/principles.md';
    writeMarkdownFile({
      filePath,
      frontmatter: {
        title: 'Product Principles',
        createdAt: new Date().toISOString(),
        type: 'principles',
      },
      content: finalPrinciples,
    });

    console.log(`\n✅ Saved to ${filePath}`);
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new Error(`Failed to handle principles step: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 