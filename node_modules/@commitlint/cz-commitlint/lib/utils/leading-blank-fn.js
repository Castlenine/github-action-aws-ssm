import { ruleIsActive, ruleIsNotApplicable } from './rules.js';
/**
 * Get forced leading for rule
 * @param rule to parse
 * @return transform function applying the leading
 */
export default function getLeadingBlankFn(rule) {
    if (!rule || !ruleIsActive(rule)) {
        return (input) => input;
    }
    const remove = (input) => {
        const fragments = input.split('\n');
        while (fragments.length > 0 && fragments[0] === '') {
            fragments.shift();
        }
        return fragments.join('\n');
    };
    const lead = (input) => {
        const fragments = input.split('\n');
        return fragments[0] === '' ? input : ['', ...fragments].join('\n');
    };
    return !ruleIsNotApplicable(rule) ? lead : remove;
}
//# sourceMappingURL=leading-blank-fn.js.map