import { QualifiedRules } from '@commitlint/types';
import type { Rule } from '../types.js';
export declare function getRule(key: string, property: string): Rule | undefined;
export declare function setRules(newRules: QualifiedRules): void;
export type GetRuleMethod = typeof getRule;
export type SetRulesMethod = typeof setRules;
//# sourceMappingURL=rules.d.ts.map