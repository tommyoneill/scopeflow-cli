import { text, confirm, select } from '../utils/prompts.js';
import { refineJobs } from '../utils/llm.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { editContent } from '../utils/editor.js';
import path from 'path';
import { slugify } from '../utils/slugify.js';

export async function handleJobsStep(personaName: string, personaContent: string, vision: string) {
  const input = await text({
    message: `What jobs does ${personaName} need to get done?`,
    placeholder: 'I need to record high-quality audio without expensive equipment...',
  });

  if (!input) return;

  console.log('\n✨ Using AI to format those jobs...');
  const jobs = await refineJobs(input as string, personaContent, vision);

  console.log('\n💡 Suggested Jobs:\n');
  console.log(jobs.formatted);

  const action = await select({
    message: 'What would you like to do?',
    options: [
      { value: 'accept', label: 'Accept' },
      { value: 'edit', label: 'Edit' },
      { value: 'retry', label: 'Retry' },
      { value: 'cancel', label: 'Cancel' },
    ],
  });

  if (action === 'cancel') return;
  if (action === 'retry') {
    return handleJobsStep(personaName, personaContent, vision);
  }

  let finalContent = jobs.formatted;
  if (action === 'edit') {
    const editedContent = await editContent(jobs.formatted, `Jobs for ${personaName}`);
    if (!editedContent) {
      console.log('❌ Failed to edit content. Please try again.');
      return handleJobsStep(personaName, personaContent, vision);
    }
    finalContent = editedContent;
  }

  const personaSlug = slugify(personaName);
  const filePath = path.join(process.cwd(), '.scopeflow', 'jobs', `${personaSlug}.md`);

  writeMarkdownFile({
    filePath,
    frontmatter: {
      title: `Jobs for ${personaName}`,
      type: 'jobs',
      persona: personaName,
      createdAt: new Date().toISOString(),
    },
    content: finalContent,
  });

  console.log(`✅ Saved to .scopeflow/jobs/${personaSlug}.md`);
}
