/**
 * Base interface for all ScopeFlow documents
 */
export interface ScopeFlowDocument {
    title: string;
    type: DocumentType;
    createdAt: string;
}
/**
 * Types of documents in ScopeFlow
 */
export type DocumentType = 'strategy' | 'persona' | 'jobs' | 'solutions' | 'vision';
/**
 * Persona document structure
 */
export interface PersonaDocument extends ScopeFlowDocument {
    type: 'persona';
    name: string;
    goals: string[];
    frustrations: string[];
    tools: string[];
    behaviors: string[];
}
/**
 * Jobs document structure
 */
export interface JobsDocument extends ScopeFlowDocument {
    type: 'jobs';
    persona: string;
    jobs: Job[];
}
/**
 * Individual job structure
 */
export interface Job {
    name: string;
    trigger: string;
    outcome: string;
    successMetric: string;
}
/**
 * Solutions document structure
 */
export interface SolutionsDocument extends ScopeFlowDocument {
    type: 'solutions';
    persona: string;
    solutions: Solution[];
}
/**
 * Individual solution structure
 */
export interface Solution {
    title: string;
    description: string;
    features: string[];
    alignment: string;
}
/**
 * Strategy document structure
 */
export interface StrategyDocument extends ScopeFlowDocument {
    type: 'strategy';
    content: string;
}
/**
 * Vision document structure
 */
export interface VisionDocument extends ScopeFlowDocument {
    type: 'vision';
    content: string;
}
/**
 * LLM response types
 */
export interface LLMResponse<T> {
    formatted: T;
}
/**
 * Editor configuration
 */
export interface EditorConfig {
    editor: string;
}
/**
 * Prompt response types
 */
export interface PromptResponse<T> {
    value: T;
    label: string;
}
