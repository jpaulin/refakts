import { RefactoringCommand, CommandOptions } from './command';
import { ConsoleOutput } from '../../command-line-parser/output-formatter/console-output';
import { Node, VariableDeclaration } from 'ts-morph';
import { ASTService } from '../ast/ast-service';
import { VariableDeclarationFinder } from '../services/variable-declaration-finder';
import { ExpressionAnalyzer } from '../services/expression-analyzer';
import { VariableReplacer } from '../transformations/variable-replacer';
import { LocationRange } from '../ast/location-range';
import { NodeAnalyzer } from '../services/node-analyzer';

export class InlineVariableCommand implements RefactoringCommand {
  readonly name = 'inline-variable';
  readonly description = 'Replace variable usage with its value';
  readonly complete = true;

  private consoleOutput!: ConsoleOutput;
  private astService!: ASTService;
  private declarationFinder = new VariableDeclarationFinder();
  private expressionAnalyzer = new ExpressionAnalyzer();
  private variableReplacer = new VariableReplacer();

  async execute(file: string, options: CommandOptions): Promise<void> {
    this.validateOptions(options);
    this.astService = ASTService.createForFile(file);
    const sourceFile = this.astService.loadSourceFile(file);
    const node = this.findTargetNode(options);
    await this.performInlineVariable(node);
    await this.astService.saveSourceFile(sourceFile);
  }

  private findTargetNode(options: CommandOptions): Node {
    return this.astService.findNodeByLocation(options.location as LocationRange);
  }

  validateOptions(options: CommandOptions): void {
    if (!options.location) {
      throw new Error('Location format must be specified');
    }
  }

  getHelpText(): string {
    return '\nExamples:\n  refakts inline-variable "[src/file.ts 5:8-5:18]"';
  }

  private async performInlineVariable(node: Node): Promise<void> {
    this.validateTargetNode(node);
    const variableName = node.getText();
    const sourceFile = node.getSourceFile();
    const declaration = this.declarationFinder.findVariableDeclaration(sourceFile, variableName, node);
    const initializerText = this.getInitializerText(declaration, variableName);
    const replacementCount = this.variableReplacer.replaceAllReferences(variableName, declaration, initializerText);
    this.variableReplacer.removeDeclaration(declaration);
    this.outputSuccessMessage(variableName, replacementCount);
  }

  private outputSuccessMessage(variableName: string, replacementCount: number): void {
    const occurrences = replacementCount === 1 ? 'occurrence' : 'occurrences';
    const message = `Successfully inlined variable '${variableName}' (${replacementCount} ${occurrences} replaced)`;
    this.consoleOutput.log(message);
  }

  private validateTargetNode(node: Node): void {
    if (this.isDestructuringPattern(node)) {
      throw new Error('Destructuring declaration has no initializer to inline');
    }
    NodeAnalyzer.validateIdentifierNode(node);
  }

  private isDestructuringPattern(node: Node): boolean {
    return node.getKindName() === 'OpenBraceToken' || 
           node.getKindName() === 'CloseBraceToken' ||
           Node.isObjectBindingPattern(node);
  }

  private getInitializerText(declaration: VariableDeclaration, variableName?: string, context?: Node): string {
    const nameNode = declaration.getNameNode();
    
    if (Node.isObjectBindingPattern(nameNode) && variableName) {
      return this.getDestructuringInitializer(declaration, variableName);
    }
    
    return this.getRegularInitializer(declaration, context);
  }

  private getDestructuringInitializer(declaration: VariableDeclaration, variableName: string): string {
    const initializer = declaration.getInitializer();
    if (!initializer) {
      throw new Error('Destructuring declaration has no initializer to inline');
    }
    
    const initializerText = initializer.getText();
    return `${initializerText}.${variableName}`;
  }

  private getRegularInitializer(declaration: VariableDeclaration, context?: Node): string {
    const initializer = declaration.getInitializer();
    if (!initializer) {
      throw new Error('Variable has no initializer to inline');
    }
    
    return this.expressionAnalyzer.formatWithParentheses(initializer, context);
  }

  setConsoleOutput(consoleOutput: ConsoleOutput): void {
    this.consoleOutput = consoleOutput;
  }
}