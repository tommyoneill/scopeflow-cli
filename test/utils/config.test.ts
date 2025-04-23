import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getConfig } from '../../src/utils/config.js';
import { ConfigError, FileSystemError } from '../../src/utils/errors.js';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

// Mock prompts module
vi.mock('../../src/utils/prompts.js', () => ({
  select: vi.fn(),
}));

describe('getConfig', () => {
  const CONFIG_DIR = path.join(os.homedir(), '.scopeflow');
  const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create config directory if it does not exist', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === CONFIG_DIR) return false;
      return false;
    });

    (fs.mkdirSync as any).mockImplementation(() => {});
    (fs.writeFileSync as any).mockImplementation(() => {});

    await getConfig();

    expect(fs.mkdirSync).toHaveBeenCalledWith(CONFIG_DIR, { recursive: true });
  });

  it('should read existing config if it exists', async () => {
    const mockConfig = { editor: 'code' };
    
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === CONFIG_DIR) return true;
      if (path === CONFIG_FILE) return true;
      return false;
    });

    (fs.readFileSync as any).mockImplementation(() => JSON.stringify(mockConfig));

    const config = await getConfig();

    expect(config).toEqual(mockConfig);
    expect(fs.readFileSync).toHaveBeenCalledWith(CONFIG_FILE, 'utf-8');
  });

  it('should throw ConfigError for invalid config format', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === CONFIG_DIR) return true;
      if (path === CONFIG_FILE) return true;
      return false;
    });

    (fs.readFileSync as any).mockImplementation(() => JSON.stringify({}));

    await expect(getConfig()).rejects.toThrow(ConfigError);
  });

  it('should throw FileSystemError for file system errors', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === CONFIG_DIR) return true;
      if (path === CONFIG_FILE) return true;
      return false;
    });

    (fs.readFileSync as any).mockImplementation(() => {
      throw new Error('File system error');
    });

    await expect(getConfig()).rejects.toThrow(FileSystemError);
  });

  it('should create new config if none exists', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === CONFIG_DIR) return true;
      if (path === CONFIG_FILE) return false;
      return false;
    });

    const mockEditor = 'code';
    (fs.writeFileSync as any).mockImplementation(() => {});

    const { select } = await import('../../src/utils/prompts.js');
    (select as any).mockResolvedValue(mockEditor);

    const config = await getConfig();

    expect(config).toEqual({ editor: mockEditor });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CONFIG_FILE,
      JSON.stringify({ editor: mockEditor }, null, 2)
    );
  });
}); 