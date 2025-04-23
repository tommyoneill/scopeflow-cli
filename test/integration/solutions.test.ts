import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleSolutionsStep } from '../../src/prompts/init-solutions.js';
import { refineSolutions } from '../../src/utils/llm.js';
import { writeMarkdownFile } from '../../src/utils/markdown.js';
import fs from 'fs';
import path from 'path';

// Mock dependencies
vi.mock('../../src/utils/llm.js', () => ({
  refineSolutions: vi.fn(),
}));

vi.mock('../../src/utils/markdown.js', () => ({
  writeMarkdownFile: vi.fn(),
}));

vi.mock('../../src/utils/prompts.js', () => ({
  text: vi.fn(),
  confirm: vi.fn(),
}));

describe('handleSolutionsStep', () => {
  const mockPersonaName = 'Test Persona';
  const mockJobsContent = 'Test jobs content';
  const mockVision = 'Test vision';
  const mockInput = 'Test solutions input';
  const mockRefinedSolutions = { formatted: 'Test refined solutions' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle successful solution generation and acceptance', async () => {
    // Mock prompts
    const { text, confirm } = await import('../../src/utils/prompts.js');
    (text as any).mockResolvedValue(mockInput);
    (confirm as any).mockResolvedValueOnce(true); // Accept version

    // Mock LLM
    (refineSolutions as any).mockResolvedValue(mockRefinedSolutions);

    // Mock file system
    const mockFilePath = path.join(process.cwd(), '.scopeflow', 'solutions', 'solutions-test-persona.md');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

    await handleSolutionsStep(mockPersonaName, mockJobsContent, mockVision);

    // Verify LLM was called with correct parameters
    expect(refineSolutions).toHaveBeenCalledWith(mockInput, mockJobsContent, mockVision);

    // Verify file was written
    expect(writeMarkdownFile).toHaveBeenCalledWith({
      filePath: mockFilePath,
      frontmatter: {
        title: `Solutions for ${mockPersonaName}`,
        type: 'solutions',
        persona: mockPersonaName,
        createdAt: expect.any(String),
      },
      content: mockRefinedSolutions.formatted,
    });
  });

  it('should retry when user rejects version and wants to try again', async () => {
    // Mock prompts
    const { text, confirm } = await import('../../src/utils/prompts.js');
    (text as any).mockResolvedValue(mockInput);
    (confirm as any)
      .mockResolvedValueOnce(false) // Reject first version
      .mockResolvedValueOnce(true) // Want to try again
      .mockResolvedValueOnce(true); // Accept second version

    // Mock LLM to return different solutions each time
    (refineSolutions as any)
      .mockResolvedValueOnce({ formatted: 'First version' })
      .mockResolvedValueOnce({ formatted: 'Second version' });

    await handleSolutionsStep(mockPersonaName, mockJobsContent, mockVision);

    // Verify LLM was called twice
    expect(refineSolutions).toHaveBeenCalledTimes(2);
    expect(writeMarkdownFile).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Second version',
      })
    );
  });

  it('should exit when user rejects version and does not want to try again', async () => {
    // Mock prompts
    const { text, confirm } = await import('../../src/utils/prompts.js');
    (text as any).mockResolvedValue(mockInput);
    (confirm as any)
      .mockResolvedValueOnce(false) // Reject version
      .mockResolvedValueOnce(false); // Don't want to try again

    // Mock LLM
    (refineSolutions as any).mockResolvedValue(mockRefinedSolutions);

    await handleSolutionsStep(mockPersonaName, mockJobsContent, mockVision);

    // Verify LLM was called once
    expect(refineSolutions).toHaveBeenCalledTimes(1);
    // Verify file was not written
    expect(writeMarkdownFile).not.toHaveBeenCalled();
  });

  it('should handle empty input', async () => {
    // Mock prompts
    const { text } = await import('../../src/utils/prompts.js');
    (text as any).mockResolvedValue('');

    await handleSolutionsStep(mockPersonaName, mockJobsContent, mockVision);

    // Verify LLM was not called
    expect(refineSolutions).not.toHaveBeenCalled();
    // Verify file was not written
    expect(writeMarkdownFile).not.toHaveBeenCalled();
  });
}); 