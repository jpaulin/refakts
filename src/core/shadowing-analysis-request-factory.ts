import { Node } from 'ts-morph';
import { NodeContext } from './services/core-node-context';
import { ShadowingAnalysisRequest } from './locators/shadowing-analysis-request';

export class ShadowingAnalysisRequestFactory {
  static create(usage: Node, declaration: Node, variableName: string): ShadowingAnalysisRequest {
    const usageContext = NodeContext.create(usage, usage.getSourceFile());
    const declarationContext = NodeContext.create(declaration, declaration.getSourceFile());
    return new ShadowingAnalysisRequest(usageContext, declarationContext, variableName);
  }
}