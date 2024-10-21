import chalk from 'chalk';
import inquirer from 'inquirer';
export default class Question {
    _question;
    messages;
    skip;
    _maxLength;
    _minLength;
    title;
    caseFn;
    fullStopFn;
    multipleValueDelimiters;
    multipleSelectDefaultDelimiter;
    constructor(name, { title, enumList, messages, defaultValue, when, skip, fullStopFn, caseFn, maxLength, minLength, multipleValueDelimiters, multipleSelectDefaultDelimiter, }) {
        if (!name || typeof name !== 'string')
            throw new Error('Question: name is required');
        this._maxLength = maxLength ?? Infinity;
        this._minLength = minLength ?? 0;
        this.messages = messages;
        this.title = title ?? '';
        this.skip = skip ?? false;
        this.fullStopFn = fullStopFn ?? ((_) => _);
        this.caseFn =
            caseFn ??
                ((input, delimiter) => Array.isArray(input) ? input.join(delimiter) : input);
        this.multipleValueDelimiters = multipleValueDelimiters;
        this.multipleSelectDefaultDelimiter = multipleSelectDefaultDelimiter;
        if (enumList && Array.isArray(enumList)) {
            this._question = {
                type: multipleSelectDefaultDelimiter ? 'checkbox' : 'list',
                choices: skip
                    ? [
                        ...enumList,
                        new inquirer.Separator(),
                        {
                            name: 'empty',
                            value: '',
                        },
                    ]
                    : [...enumList],
            };
        }
        else if (/^is[A-Z]/.test(name)) {
            this._question = {
                type: 'confirm',
            };
        }
        else {
            this._question = {
                type: 'input',
                transformer: this.transformer.bind(this),
            };
        }
        Object.assign(this._question, {
            name,
            default: defaultValue,
            when,
            validate: this.validate.bind(this),
            filter: this.filter.bind(this),
            message: this.decorateMessage.bind(this),
        });
    }
    getMessage(key) {
        return this.messages[key] ?? '';
    }
    get question() {
        return this._question;
    }
    get maxLength() {
        return this._maxLength;
    }
    set maxLength(maxLength) {
        this._maxLength = maxLength;
    }
    get minLength() {
        return this._minLength;
    }
    set minLength(minLength) {
        this._minLength = minLength;
    }
    beforeQuestionStart(_answers) {
        return;
    }
    validate(input) {
        const output = this.filter(input);
        const questionName = this.question.name ?? '';
        if (!this.skip && output.length === 0) {
            return this.getMessage('emptyWarning').replace(/%s/g, questionName);
        }
        if (output.length > this.maxLength) {
            return this.getMessage('upperLimitWarning')
                .replace(/%s/g, questionName)
                .replace(/%d/g, `${output.length - this.maxLength}`);
        }
        if (output.length < this.minLength) {
            return this.getMessage('lowerLimitWarning')
                .replace(/%s/g, questionName)
                .replace(/%d/g, `${this.minLength - output.length}`);
        }
        return true;
    }
    filter(input) {
        let toCased;
        if (Array.isArray(input)) {
            toCased = this.caseFn(input, this.multipleSelectDefaultDelimiter);
        }
        else if (this.multipleValueDelimiters) {
            const segments = input.split(this.multipleValueDelimiters);
            const casedString = this.caseFn(segments, ',');
            const casedSegments = casedString.split(',');
            toCased = input.replace(new RegExp(`[^${this.multipleValueDelimiters.source}]+`, 'g'), (segment) => {
                return casedSegments[segments.indexOf(segment)];
            });
        }
        else {
            toCased = this.caseFn(input);
        }
        return this.fullStopFn(toCased);
    }
    transformer(input, _answers) {
        const output = this.filter(input);
        if (this.maxLength === Infinity && this.minLength === 0) {
            return output;
        }
        const color = output.length <= this.maxLength && output.length >= this.minLength
            ? chalk.green
            : chalk.red;
        return color('(' + output.length + ') ' + output);
    }
    decorateMessage(_answers) {
        if (this.beforeQuestionStart) {
            this.beforeQuestionStart(_answers);
        }
        if (this.question.type === 'input') {
            const countLimitMessage = (() => {
                const messages = [];
                if (this.minLength > 0 && this.getMessage('min')) {
                    messages.push(this.getMessage('min').replace(/%d/g, this.minLength + ''));
                }
                if (this.maxLength < Infinity && this.getMessage('max')) {
                    messages.push(this.getMessage('max').replace(/%d/g, this.maxLength + ''));
                }
                return messages.join(', ');
            })();
            const skipMessage = this.skip && this.getMessage('skip');
            return (this.title +
                (skipMessage ? ` ${skipMessage}` : '') +
                ':' +
                (countLimitMessage ? ` ${countLimitMessage}` : '') +
                '\n');
        }
        else {
            return `${this.title}:`;
        }
    }
}
//# sourceMappingURL=Question.js.map