export declare function enableTestMode(inputs: (string | boolean)[]): void;
export declare function disableTestMode(): void;
export declare const text: (options: any) => Promise<string | boolean | symbol>;
export declare const confirm: (options: any) => Promise<string | boolean | symbol>;
export declare const select: (options: any) => Promise<unknown>;
