export declare function refineVision(raw: string): Promise<string>;
export declare function getPersonaNameOptions(raw: string, vision: string): Promise<string[]>;
export declare function refinePersona(raw: string, vision: string, selectedName: string): Promise<{
    name: string;
    formatted: string;
}>;
export declare function refineJobs(persona: string, raw: string, vision: string): Promise<{
    formatted: string;
}>;
interface RefineOptions {
    personaName?: string;
    jobsContent?: string;
    vision?: string;
}
export declare function refineProblemSpace(input: string): Promise<string>;
export declare function refineValueProposition(input: string): Promise<string>;
export declare function refinePrinciples(input: string): Promise<string>;
export declare function refineSolutions(input: string, options?: RefineOptions): Promise<string>;
export {};
