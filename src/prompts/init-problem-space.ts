import { text, isCancel } from '@clack/prompts';
import { writeMarkdownFile } from '../utils/markdown.js';
import path from 'path';

export async function handleProblemSpaceStep(): Promise<symbol | void> {
  const problemSpace = await text({
    message: 'What problem space are you working in?',
    placeholder: 'Describe the key challenges and opportunities in your domain',
    validate: (value) => {
      if (!value) return 'Problem space description is required';
      if (value.length < 10) return 'Please provide a more detailed description';
      return;
    },
  });

  if (isCancel(problemSpace)) return problemSpace;

  // Save problem space to markdown file
  await writeMarkdownFile({
    filePath: path.join('.scopeflow', 'problem-space.md'),
    frontmatter: {
      title: 'Problem Space',
      createdAt: new Date().toISOString(),
      type: 'problem-space'
    },
    content: problemSpace.toString()
  });

  return;
} 