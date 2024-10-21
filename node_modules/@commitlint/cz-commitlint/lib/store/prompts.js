import isPlainObject from 'lodash.isplainobject';
import defaultPromptConfigs from './defaultPromptConfigs.js';
const storeKey = Symbol('promptConfig');
const store = {
    [storeKey]: defaultPromptConfigs,
};
export function setPromptConfig(newPromptConfig) {
    const { settings, messages, questions } = newPromptConfig;
    if (messages) {
        const requiredMessageKeys = Object.keys(defaultPromptConfigs.messages);
        requiredMessageKeys.forEach((key) => {
            const message = messages[key];
            if (typeof message === 'string') {
                store[storeKey]['messages'][key] = message;
            }
        });
    }
    if (questions && isPlainObject(questions)) {
        store[storeKey]['questions'] = questions;
    }
    if (settings && isPlainObject(settings)) {
        if (settings['scopeEnumSeparator'] &&
            !/^\/|\\|,$/.test(settings['scopeEnumSeparator'])) {
            console.log(`prompt.settings.scopeEnumSeparator must be one of ',', '\\', '/'.`);
            process.exit(1);
        }
        store[storeKey]['settings'] = {
            ...defaultPromptConfigs.settings,
            ...settings,
        };
    }
}
export function getPromptMessages() {
    return (store[storeKey] && store[storeKey]['messages']) ?? {};
}
export function getPromptQuestions() {
    return (store[storeKey] && store[storeKey]['questions']) ?? {};
}
export function getPromptSettings() {
    return (store[storeKey] && store[storeKey]['settings']) ?? {};
}
//# sourceMappingURL=prompts.js.map