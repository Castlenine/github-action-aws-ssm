import { RuleConfigSeverity } from '@commitlint/types';
export function ruleIsDisabled(rule) {
    if (rule && Array.isArray(rule) && rule[0] === RuleConfigSeverity.Disabled) {
        return true;
    }
    return false;
}
/**
 * Check if a rule definition is active
 * @param rule to check
 * @return if the rule definition is active
 */
export function ruleIsActive(rule) {
    if (rule && Array.isArray(rule)) {
        return rule[0] > RuleConfigSeverity.Disabled;
    }
    return false;
}
/**
 * Check if a rule definition is applicable
 * @param rule to check
 * @return if the rule definition is applicable
 */
export function ruleIsApplicable(rule) {
    if (rule && Array.isArray(rule)) {
        return rule[1] === 'always';
    }
    return false;
}
/**
 * Check if a rule definition is applicable
 * @param rule to check
 * @return if the rule definition is applicable
 */
export function ruleIsNotApplicable(rule) {
    if (rule && Array.isArray(rule)) {
        return rule[1] === 'never';
    }
    return false;
}
export function enumRuleIsActive(rule) {
    return (ruleIsActive(rule) &&
        ruleIsApplicable(rule) &&
        Array.isArray(rule[2]) &&
        rule[2].length > 0);
}
export function getEnumList(rule) {
    return Array.isArray(rule[2]) ? rule[2] : [];
}
export function getMaxLength(rule) {
    if (rule &&
        ruleIsActive(rule) &&
        ruleIsApplicable(rule) &&
        typeof rule[2] === 'number') {
        return rule[2];
    }
    return Infinity;
}
export function getMinLength(rule) {
    if (rule &&
        ruleIsActive(rule) &&
        ruleIsApplicable(rule) &&
        typeof rule[2] === 'number') {
        return rule[2];
    }
    return 0;
}
//# sourceMappingURL=rules.js.map