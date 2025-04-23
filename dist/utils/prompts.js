import * as clackPrompts from '@clack/prompts';
let isTestMode = false;
let testInputs = [];
let currentInputIndex = 0;
export function enableTestMode(inputs) {
    isTestMode = true;
    testInputs = inputs;
    currentInputIndex = 0;
}
export function disableTestMode() {
    isTestMode = false;
    testInputs = [];
    currentInputIndex = 0;
}
export const text = async (options) => {
    if (isTestMode) {
        const input = testInputs[currentInputIndex++];
        console.log(`\n${options.message}`);
        console.log(`> ${input}`);
        return input;
    }
    return clackPrompts.text(options);
};
export const confirm = async (options) => {
    if (isTestMode) {
        const input = testInputs[currentInputIndex++];
        console.log(`\n${options.message}`);
        console.log(`> ${input ? 'Yes' : 'No'}`);
        return input;
    }
    return clackPrompts.confirm(options);
};
export const select = async (options) => {
    if (isTestMode) {
        const input = testInputs[currentInputIndex++];
        console.log(`\n${options.message}`);
        console.log(`> ${input}`);
        return input;
    }
    return clackPrompts.select(options);
};
//# sourceMappingURL=prompts.js.map