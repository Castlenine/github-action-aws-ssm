import { ruleIsActive, ruleIsNotApplicable } from './rules.js';
/**
 * Get forced case for rule
 * @param rule to parse
 * @return transform function applying the enforced case
 */
export default function getFullStopFn(rule) {
    const noop = (_) => _;
    if (!rule || !ruleIsActive(rule)) {
        return noop;
    }
    if (typeof rule[2] !== 'string')
        return noop;
    const symbol = rule[2];
    if (ruleIsNotApplicable(rule)) {
        return (input) => {
            while (input.length > 0 && input.endsWith(symbol)) {
                input = input.slice(0, input.length - 1);
            }
            return input;
        };
    }
    else {
        return (input) => {
            return !input.endsWith(symbol) ? input + symbol : input;
        };
    }
}
//# sourceMappingURL=full-stop-fn.js.map