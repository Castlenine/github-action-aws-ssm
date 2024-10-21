import Question from './Question.js';
import getRuleQuestionConfig from './services/getRuleQuestionConfig.js';
import { getPromptSettings } from './store/prompts.js';
export class HeaderQuestion extends Question {
    headerMaxLength;
    headerMinLength;
    constructor(name, questionConfig, headerMaxLength, headerMinLength) {
        super(name, questionConfig);
        this.headerMaxLength = headerMaxLength ?? Infinity;
        this.headerMinLength = headerMinLength ?? 0;
    }
    beforeQuestionStart(answers) {
        const headerRemainLength = this.headerMaxLength - combineCommitMessage(answers).length;
        this.maxLength = Math.min(this.maxLength, headerRemainLength);
        this.minLength = Math.min(this.minLength, this.headerMinLength);
    }
}
export function combineCommitMessage(answers) {
    const { type = '', scope = '', subject = '' } = answers;
    const prefix = `${type}${scope ? `(${scope})` : ''}`;
    if (subject) {
        return ((prefix ? prefix + ': ' : '') + subject).trim();
    }
    else {
        return prefix.trim();
    }
}
export function getQuestions() {
    // header: type, scope, subject
    const questions = [];
    const headerRuleFields = ['type', 'scope', 'subject'];
    const headerRuleQuestionConfig = getRuleQuestionConfig('header');
    if (!headerRuleQuestionConfig) {
        return [];
    }
    headerRuleFields.forEach((name) => {
        const questionConfig = getQuestionConfig(name);
        if (questionConfig) {
            const instance = new HeaderQuestion(name, questionConfig, headerRuleQuestionConfig.maxLength, headerRuleQuestionConfig.minLength);
            questions.push(instance.question);
        }
    });
    return questions;
}
export function getQuestionConfig(name) {
    const questionConfig = getRuleQuestionConfig(name);
    if (questionConfig) {
        if (name === 'scope') {
            if (getPromptSettings()['enableMultipleScopes']) {
                questionConfig.multipleSelectDefaultDelimiter =
                    getPromptSettings()['scopeEnumSeparator'];
            }
            // split scope string to segments, match commitlint rules
            questionConfig.multipleValueDelimiters = /\/|\\|,/g;
        }
    }
    return questionConfig;
}
//# sourceMappingURL=SectionHeader.js.map