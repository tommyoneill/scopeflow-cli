import { text, confirm, select } from '../utils/prompts.js';
import { refinePersona, getPersonaNameOptions } from '../utils/llm.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { editContent } from '../utils/editor.js';
import path from 'path';
import { slugify } from '../utils/slugify.js';
import { handleJobsStep } from './init-jobs.js';
export async function handlePersonaStep(vision) {
    const input = await text({
        message: 'Describe your primary user (just free text):',
        placeholder: 'An indie podcast host who does everything themselves...',
    });
    if (!input)
        return;
    console.log('\n✨ Getting persona name options...');
    const nameOptions = await getPersonaNameOptions(input, vision);
    const selectedName = await select({
        message: 'Select the most appropriate role title for this user:',
        options: nameOptions.map(name => ({ value: name, label: name })),
    });
    if (!selectedName)
        return;
    console.log('\n✨ Getting persona definition...');
    const persona = await refinePersona(input, vision, selectedName);
    console.log('\n💡 Suggested Persona:\n');
    console.log(persona.formatted);
    const action = await select({
        message: 'What would you like to do?',
        options: [
            { value: 'accept', label: 'Accept' },
            { value: 'edit', label: 'Edit' },
            { value: 'retry', label: 'Retry' },
            { value: 'cancel', label: 'Cancel' },
        ],
    });
    if (action === 'cancel')
        return;
    if (action === 'retry') {
        return handlePersonaStep(vision);
    }
    let finalContent = persona.formatted;
    if (action === 'edit') {
        const editedContent = await editContent(persona.formatted, `Persona: ${persona.name}`);
        if (!editedContent) {
            console.log('❌ Failed to edit content. Please try again.');
            return handlePersonaStep(vision);
        }
        finalContent = editedContent;
    }
    const personaSlug = slugify(persona.name);
    const filePath = path.join(process.cwd(), '.scopeflow', 'personas', `${personaSlug}.md`);
    writeMarkdownFile({
        filePath,
        frontmatter: {
            title: persona.name,
            type: 'persona',
            createdAt: new Date().toISOString(),
        },
        content: finalContent,
    });
    console.log(`✅ Saved to .scopeflow/personas/${personaSlug}.md`);
    const defineJobs = await confirm({
        message: `Would you like to define Jobs to Be Done for "${persona.name}"?`,
    });
    if (defineJobs) {
        await handleJobsStep(persona.name, finalContent, vision);
    }
    const addAnother = await confirm({
        message: 'Would you like to add another persona?',
    });
    if (addAnother) {
        await handlePersonaStep(vision); // Recursive call
    }
}
//# sourceMappingURL=init-persona.js.map