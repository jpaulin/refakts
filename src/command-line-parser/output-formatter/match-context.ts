import { SelectMatch } from '../../core/services/selection/selection-types';

export class MatchContext {
  public readonly content: string;
  public readonly lines: string[];
  public readonly fileName: string;
  public readonly filePath?: string;

  constructor(_content: string, _lines: string[], _fileName: string, _filePath?: string) {
    this.content = _content;
    this.lines = _lines;
    this.fileName = _fileName;
    this.filePath = _filePath;
  }

  static fromContent(content: string, fileName: string, filePath?: string): MatchContext {
    const lines = content.split('\n');
    return new MatchContext(content, lines, fileName, filePath);
  }

  getIndexFromLineColumn(line: number, column: number): number {
    let index = 0;
    
    for (let i = 0; i < line - 1; i++) {
      index += this.lines[i].length + 1;
    }
    
    return index + column - 1;
  }

  getLineColumnFromIndex(index: number): { line: number; column: number } | null {
    const beforeIndex = this.content.substring(0, index);
    const lines = beforeIndex.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
  }

  getMatchPositions(match: RegExpExecArray) {
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    
    const startPos = this.getLineColumnFromIndex(startIndex);
    const endPos = this.getLineColumnFromIndex(endIndex);
    
    return startPos && endPos ? { startPos, endPos } : null;
  }

  isMatchInComment(selectMatch: SelectMatch): boolean {
    const beforeMatch = this.content.substring(0, this.getIndexFromLineColumn(selectMatch.line, selectMatch.column));
    const commentStartIndex = beforeMatch.lastIndexOf('/**');
    const commentEndIndex = beforeMatch.lastIndexOf('*/');
    
    return commentStartIndex > commentEndIndex;
  }
}