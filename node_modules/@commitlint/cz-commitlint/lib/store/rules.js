const storeKey = Symbol('rules');
const store = {
    [storeKey]: {},
};
export function getRule(key, property) {
    if (key.split('-').length > 1) {
        return;
    }
    return store[storeKey][`${key}-${property}`];
}
export function setRules(newRules) {
    store[storeKey] = newRules;
}
//# sourceMappingURL=rules.js.map