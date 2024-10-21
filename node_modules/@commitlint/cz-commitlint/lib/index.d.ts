import type { Answers, DistinctQuestion } from 'inquirer';
type Commit = (message: string) => void;
/**
 * Entry point for commitizen
 * @param  inquirerIns instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export declare function prompter(inquirerIns: {
    prompt(questions: DistinctQuestion[]): Promise<Answers>;
}, commit: Commit): void;
export {};
//# sourceMappingURL=index.d.ts.map