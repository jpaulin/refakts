import { SourceFile } from 'ts-morph';
import { LocationRange } from '../ast/location-range';
import { SelectMatch } from '../services/selection/selection-types';


export class PositionData {
  public readonly line: number;
  public readonly column: number;
  public readonly offset?: number;
  public readonly length?: number;

  constructor(_line: number, _column: number, _offset?: number, _length?: number) {
    this.line = _line;
    this.column = _column;
    this.offset = _offset;
    this.length = _length;
  }

  static fromLocation(location: LocationRange): PositionData {
    return new PositionData(
      location.start.line,
      location.start.column,
      undefined,
      undefined
    );
  }

  static fromRange(location: LocationRange): PositionData {
    const { startOffset, length } = this.calculateRangeOffsets(location);
    
    return new PositionData(
      location.start.line,
      location.start.column,
      startOffset,
      length
    );
  }

  private static calculateRangeOffsets(location: LocationRange): { startOffset: number; length: number } {
    const startOffset = this.calculateOffset(location.start.line, location.start.column);
    const endOffset = this.calculateOffset(location.end.line, location.end.column);
    return { startOffset, length: endOffset - startOffset };
  }

  static fromSelectMatch(match: SelectMatch): PositionData {
    return new PositionData(
      match.line,
      match.column,
      undefined,
      undefined
    );
  }

  static fromNodePosition(sourceFile: SourceFile, offset: number): PositionData {
    const { line, column } = sourceFile.getLineAndColumnAtPos(offset);
    return new PositionData(line, column, offset);
  }

  toZeroBased(): { line: number; column: number } {
    return {
      line: this.line - 1,
      column: this.column - 1
    };
  }

  toOneBased(): { line: number; column: number } {
    return {
      line: this.line,
      column: this.column
    };
  }

  toLocationRange(file: string, endLine?: number, endColumn?: number): LocationRange {
    return new LocationRange(
      file,
      { line: this.line, column: this.column },
      { line: endLine ?? this.line, column: endColumn ?? this.column }
    );
  }

  toOffset(sourceFile: SourceFile): number {
    return this.offset ?? this.calculateOffsetFromPosition(sourceFile);
  }

  private calculateOffsetFromPosition(sourceFile: SourceFile): number {
    const zeroBased = this.toZeroBased();
    return sourceFile.compilerNode.getPositionOfLineAndCharacter(
      zeroBased.line,
      zeroBased.column
    );
  }
  formatLocation(fileName: string, endLine?: number, endColumn?: number): string {
    const end = endLine && endColumn ? `-${endLine}:${endColumn}` : '';
    return `[${fileName} ${this.line}:${this.column}${end}]`;
  }

  withPosition(line: number, column: number): PositionData {
    return new PositionData(line, column, this.offset, this.length);
  }

  withOffset(offset: number, length?: number): PositionData {
    return new PositionData(this.line, this.column, offset, length);
  }

  isBefore(other: PositionData): boolean {
    return this.line < other.line || 
           (this.line === other.line && this.column < other.column);
  }

  isAfter(other: PositionData): boolean {
    return this.line > other.line || 
           (this.line === other.line && this.column > other.column);
  }

  equals(other: PositionData): boolean {
    return this.line === other.line && this.column === other.column;
  }

  toSourceFilePosition(sourceFile: SourceFile): number {
    try {
      return this.toOffset(sourceFile);
    } catch {
      throw new Error(`No node found at position ${this.line}:${this.column}`);
    }
  }


  private static calculateOffset(line: number, column: number): number {
    return (line - 1) * 80 + (column - 1);
  }
}