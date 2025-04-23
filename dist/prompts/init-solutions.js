import { text, confirm } from '@clack/prompts';
import { refineSolutions } from '../utils/llm.js';
import { writeMarkdownFile } from '../utils/markdown.js';
import { FileSystemError } from '../utils/errors.js';
export async function handleSolutionsStep(personaName, jobsContent, vision) {
    try {
        console.log('\n💡 Now, let\'s define your solutions...');
        const rawSolutions = await text({
            message: 'What solutions are you considering?',
            placeholder: 'Describe your potential solutions...',
        });
        if (!rawSolutions || typeof rawSolutions !== 'string') {
            throw new Error('No input provided for solutions');
        }
        console.log('\n✨ Using AI to format those solutions...');
        const refinedSolutions = await refineSolutions(rawSolutions, {
            personaName,
            jobsContent,
            vision
        });
        console.log('\n💡 Suggested Solutions:\n');
        console.log(refinedSolutions);
        const accept = await confirm({
            message: 'Use this version?',
        });
        const finalSolutions = accept ? refinedSolutions : rawSolutions;
        const filePath = '.scopeflow/solutions.md';
        writeMarkdownFile({
            filePath,
            frontmatter: {
                title: 'Solutions',
                createdAt: new Date().toISOString(),
                type: 'solutions',
            },
            content: finalSolutions,
        });
        console.log(`\n✅ Saved to ${filePath}`);
    }
    catch (error) {
        if (error instanceof FileSystemError) {
            throw error;
        }
        throw new Error(`Failed to handle solutions step: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=init-solutions.js.map