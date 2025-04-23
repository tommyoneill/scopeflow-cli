import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleProblemSpaceStep, handleValuePropositionStep, handlePrinciplesStep } from '../../src/prompts/init-strategy.js';
import { refineVision } from '../../src/utils/llm.js';
import { writeMarkdownFile } from '../../src/utils/markdown.js';
import fs from 'fs';
import path from 'path';

// Mock dependencies
vi.mock('../../src/utils/llm.js', () => ({
  refineVision: vi.fn(),
}));

vi.mock('../../src/utils/markdown.js', () => ({
  writeMarkdownFile: vi.fn(),
}));

vi.mock('../../src/utils/prompts.js', () => ({
  text: vi.fn(),
  confirm: vi.fn(),
}));

describe('Strategy Steps', () => {
  const mockInput = 'Test input';
  const mockRefined = 'Test refined content';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('handleProblemSpaceStep', () => {
    it('should handle successful problem space generation and acceptance', async () => {
      // Mock prompts
      const { text, confirm } = await import('../../src/utils/prompts.js');
      (text as any).mockResolvedValue(mockInput);
      (confirm as any).mockResolvedValueOnce(true); // Accept version

      // Mock LLM
      (refineVision as any).mockResolvedValue(mockRefined);

      // Mock file system
      const mockFilePath = path.join(process.cwd(), '.scopeflow', 'problem.md');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

      await handleProblemSpaceStep();

      // Verify LLM was called
      expect(refineVision).toHaveBeenCalledWith(mockInput);

      // Verify file was written
      expect(writeMarkdownFile).toHaveBeenCalledWith({
        filePath: mockFilePath,
        frontmatter: {
          title: 'Problem Space',
          type: 'strategy',
          createdAt: expect.any(String),
        },
        content: mockRefined,
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

      // Mock LLM to return different content each time
      (refineVision as any)
        .mockResolvedValueOnce('First version')
        .mockResolvedValueOnce('Second version');

      await handleProblemSpaceStep();

      // Verify LLM was called twice
      expect(refineVision).toHaveBeenCalledTimes(2);
      expect(writeMarkdownFile).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Second version',
        })
      );
    });
  });

  describe('handleValuePropositionStep', () => {
    it('should handle successful value proposition generation and acceptance', async () => {
      // Mock prompts
      const { text, confirm } = await import('../../src/utils/prompts.js');
      (text as any).mockResolvedValue(mockInput);
      (confirm as any).mockResolvedValueOnce(true); // Accept version

      // Mock LLM
      (refineVision as any).mockResolvedValue(mockRefined);

      // Mock file system
      const mockFilePath = path.join(process.cwd(), '.scopeflow', 'value-proposition.md');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

      await handleValuePropositionStep();

      // Verify LLM was called
      expect(refineVision).toHaveBeenCalledWith(mockInput);

      // Verify file was written
      expect(writeMarkdownFile).toHaveBeenCalledWith({
        filePath: mockFilePath,
        frontmatter: {
          title: 'Value Proposition',
          type: 'strategy',
          createdAt: expect.any(String),
        },
        content: mockRefined,
      });
    });
  });

  describe('handlePrinciplesStep', () => {
    it('should handle successful principles generation and acceptance', async () => {
      // Mock prompts
      const { text, confirm } = await import('../../src/utils/prompts.js');
      (text as any).mockResolvedValue(mockInput);
      (confirm as any).mockResolvedValueOnce(true); // Accept version

      // Mock LLM
      (refineVision as any).mockResolvedValue(mockRefined);

      // Mock file system
      const mockFilePath = path.join(process.cwd(), '.scopeflow', 'principles.md');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

      await handlePrinciplesStep();

      // Verify LLM was called
      expect(refineVision).toHaveBeenCalledWith(mockInput);

      // Verify file was written
      expect(writeMarkdownFile).toHaveBeenCalledWith({
        filePath: mockFilePath,
        frontmatter: {
          title: 'Product Principles',
          type: 'strategy',
          createdAt: expect.any(String),
        },
        content: mockRefined,
      });
    });
  });
}); 