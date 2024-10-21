import { QualifiedRules, UserPromptConfig } from '@commitlint/types';
import type { Answers, DistinctQuestion } from 'inquirer';
export default function (rules: QualifiedRules, prompts: UserPromptConfig, inquirer: {
    prompt(questions: DistinctQuestion[]): Promise<Answers>;
}): Promise<string>;
//# sourceMappingURL=Process.d.ts.map