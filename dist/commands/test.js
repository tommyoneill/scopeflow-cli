import { runInit } from './init.js';
import { enableTestMode, disableTestMode } from '../utils/prompts.js';
// Mock inputs for testing
const mockInputs = [
    // Problem Space
    'Teams struggle to manage their infrastructure and deployments efficiently',
    true, // Accept AI refinement
    // Value Proposition
    'We provide a simple, unified interface for managing all infrastructure needs',
    true, // Accept AI refinement
    // Product Principles
    'Simplicity, Developer Experience, Reliability, Security',
    true, // Accept AI refinement
    // Product Vision
    'Like Stripe for DevOps',
    true, // Accept AI refinement
    // First Persona
    'DevOps Engineer who manages infrastructure and deployments',
    true, // Accept AI refinement
    true, // Define jobs
    'Need to manage infrastructure, deploy applications, monitor systems',
    true, // Accept AI refinement
    false, // Don't add another persona
];
export async function runTest() {
    console.log('🧪 Running ScopeFlow test...\n');
    try {
        enableTestMode(mockInputs);
        await runInit();
    }
    finally {
        disableTestMode();
    }
}
//# sourceMappingURL=test.js.map