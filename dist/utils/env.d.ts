interface EnvConfig {
    OPENAI_API_KEY: string;
}
export declare function loadEnvConfig(): EnvConfig;
export declare function saveEnvConfig(config: EnvConfig): void;
export {};
