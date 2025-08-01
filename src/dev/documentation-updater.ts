import { HelpContentExtractor } from './help-content-extractor';
import { QualityChecksExtractor } from './quality-checks-extractor';
import { SectionReplacer } from './section-replacer';
import { FileManager } from './file-manager';
import { ClaudeFormatter } from './formatters/claude-formatter';
import { ReadmeFormatter } from './formatters/readme-formatter';
import { SectionReplacementRequest } from './section-replacement-request';

export class DocumentationUpdater {
  private helpExtractor = new HelpContentExtractor();
  private qualityExtractor = new QualityChecksExtractor();
  private sectionReplacer = new SectionReplacer();
  private fileManager = new FileManager();
  private claudeFormatter = new ClaudeFormatter();
  private readmeFormatter = new ReadmeFormatter();

  async updateClaudeFile(filePath: string): Promise<void> {
    const helpCommands = await this.helpExtractor.extractHelpContent();
    const content = this.fileManager.readFile(filePath);
    const formattedHelp = this.claudeFormatter.formatHelpSection(helpCommands);
    const updatedContent = this.replaceHelpSection(content, formattedHelp);
    this.fileManager.writeFile(filePath, updatedContent);
  }

  private replaceHelpSection(content: string, formattedHelp: string): string {
    const request = new SectionReplacementRequest(
      content,
      '<!-- AUTO-GENERATED HELP START -->',
      '<!-- AUTO-GENERATED HELP END -->',
      formattedHelp
    );
    return this.sectionReplacer.replaceSection(request);
  }

  async updateReadmeFile(filePath: string): Promise<void> {
    const content = await this.extractAndFormatContent(filePath);
    const updatedContent = this.replaceBothSections(content);
    this.fileManager.writeFile(filePath, updatedContent.updatedContent);
  }

  private async extractAndFormatContent(filePath: string) {
    const rawContent = await this.extractRawContent(filePath);
    return this.formatContentForReadme(rawContent);
  }

  private async extractRawContent(filePath: string) {
    const helpCommands = await this.helpExtractor.extractHelpContent();
    const qualityChecks = this.qualityExtractor.extractQualityChecksContent();
    const content = this.fileManager.readFile(filePath);
    return { helpCommands, qualityChecks, content };
  }

  private formatContentForReadme(rawContent: { helpCommands: string; qualityChecks: string; content: string }) {
    return this.readmeFormatter.formatContentForReadme(rawContent);
  }

  private replaceBothSections(data: { content: string; formattedHelp: string; formattedQuality: string }) {
    let updatedContent = this.replaceHelpSectionInReadme(data.content, data.formattedHelp);
    updatedContent = this.replaceQualitySection(updatedContent, data.formattedQuality);
    return { updatedContent };
  }

  private replaceHelpSectionInReadme(content: string, formattedHelp: string): string {
    const request = new SectionReplacementRequest(
      content,
      '<!-- AUTO-GENERATED HELP START -->',
      '<!-- AUTO-GENERATED HELP END -->',
      formattedHelp
    );
    return this.sectionReplacer.replaceSection(request);
  }

  private replaceQualitySection(content: string, formattedQuality: string): string {
    const request = new SectionReplacementRequest(
      content,
      '<!-- AUTO-GENERATED QUALITY-CHECKS START -->',
      '<!-- AUTO-GENERATED QUALITY-CHECKS END -->',
      formattedQuality
    );
    return this.sectionReplacer.replaceSection(request);
  }
}