import load from '@commitlint/load';
import process from './Process.js';
/**
 * Entry point for commitizen
 * @param  inquirerIns instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(inquirerIns, commit) {
    load().then(({ rules, prompt = {} }) => {
        process(rules, prompt, inquirerIns).then(commit);
    });
}
//# sourceMappingURL=index.js.map