declare const ALLOWED_EDITORS: readonly ["code", "cursor", "nano", "vim", "emacs"];
export declare function validateEditor(editor: string): asserts editor is typeof ALLOWED_EDITORS[number];
export declare function validateConfigPath(path: string): void;
export declare function setSecureFilePermissions(filePath: string): void;
export declare function setSecureDirectoryPermissions(dirPath: string): void;
export declare function sanitizeFilename(filename: string): string;
export {};
