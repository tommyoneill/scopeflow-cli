import { text, confirm } from '../utils/prompts.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { refineVision } from '../utils/llm.js';
import path from 'path';

async function handleRefinementStep(
  input: string,
  title: string,
  filename: string,
  type: string
) {
  let refined: string | undefined;
  let accept = false;

  while (!accept) {
    console.log('\n✨ Refining your input with AI...');
    refined = await refineVision(input);

    console.log(`\n💡 Suggested ${title}:\n`);
    console.log(refined);

    const acceptResponse = await confirm({
      message: 'Use this version?',
    });

    if (!acceptResponse) {
      const retryResponse = await confirm({
        message: 'Would you like to try generating another version?',
      });
      
      if (!retryResponse) {
        return input; // Return original input if user wants to cancel
      }
    } else {
      accept = true;
    }
  }

  if (!refined) {
    console.log('❌ No refinement generated');
    return input;
  }

  const filePath = path.join(process.cwd(), '.scopeflow', filename);

  writeMarkdownFile({
    filePath,
    frontmatter: {
      title,
      type,
      createdAt: new Date().toISOString(),
    },
    content: refined,
  });

  console.log(`✅ Saved to .scopeflow/${filename}`);
  return refined;
}

export async function handleProblemSpaceStep() {
  const input = await text({
    message: 'What problem are you solving and why is it important now?',
    placeholder: 'Teams struggle to...',
  });

  if (!input) return;

  await handleRefinementStep(
    input as string,
    'Problem Space',
    'problem.md',
    'strategy'
  );
}

export async function handleValuePropositionStep() {
  const input = await text({
    message: 'How does your product create value? What\'s your key differentiator?',
    placeholder: 'Unlike existing solutions, we...',
  });

  if (!input) return;

  await handleRefinementStep(
    input as string,
    'Value Proposition',
    'value-proposition.md',
    'strategy'
  );
}

export async function handlePrinciplesStep() {
  const input = await text({
    message: 'What are your product principles? (3-5 beliefs that guide how you build)',
    placeholder: 'We believe in...',
  });

  if (!input) return;

  await handleRefinementStep(
    input as string,
    'Product Principles',
    'principles.md',
    'strategy'
  );
} 