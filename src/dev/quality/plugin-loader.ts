import { QualityCheck } from './quality-check-interface';
import { commentCheck } from './checks/comment-check';
import { fileSizeCheck } from './checks/file-size-check';
import { functionSizeCheck } from './checks/function-size-check';
import { duplicationCheck } from './checks/duplication-check';
import { unusedMethodCheck } from './checks/unused-method-check';
import { complexityCheck } from './checks/complexity-check';
import { gitDiffCheck } from './checks/git-diff-check';
import { linterCheck } from './checks/linter-check';
import { featureEnvyCheck } from './checks/feature-envy-check';
import { requireStatementsCheck } from './checks/require-statements-check';
import { singleUseVariableCheck } from './checks/single-use-variable-check';
const allQualityChecks: QualityCheck[] = [
  linterCheck,
  commentCheck,
  fileSizeCheck,
  functionSizeCheck,
  duplicationCheck,
  unusedMethodCheck,
  complexityCheck,
  featureEnvyCheck,
  gitDiffCheck,
  requireStatementsCheck,
  singleUseVariableCheck
];

export const loadQualityChecks = (): QualityCheck[] => allQualityChecks;

