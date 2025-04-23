import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export function writeMarkdownFile({ filePath, frontmatter, content, }) {
    const full = matter.stringify(content, frontmatter);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, full, 'utf8');
}
//# sourceMappingURL=markdown.js.map