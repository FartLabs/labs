import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * SourceCodeService provides a service for managing source code.
 */
export class SourceCodeService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ sourceCode: SourceCode }>,
  ) {}
}

/**
 * isSourceCode checks if the given value is a SourceCode.
 */
export function isSourceCode(
  sourceCode: unknown,
): sourceCode is SourceCode {
  return isTextSourceCode(sourceCode as SourceCode) ||
    isRemoteSourceCode(sourceCode as SourceCode) ||
    isMirroredSourceCode(sourceCode as SourceCode);
}

/**
 * SourceCode represents a source code.
 */
export type SourceCode =
  | TextSourceCode
  | MirroredSourceCode
  | RemoteSourceCode;

/**
 * isMirroredSourceCode checks if the given value is a MirroredSourceCode.
 */
export function isMirroredSourceCode(
  sourceCode: SourceCode,
): sourceCode is MirroredSourceCode {
  return "mirrored" in sourceCode && isTextSourceCode(sourceCode.mirrored) &&
    isRemoteSourceCode(sourceCode.mirrored);
}

/**
 * MirroredSourceCode represents a source code that is mirrored from a remote source.
 */
export interface MirroredSourceCode {
  readonly mirrored: TextSourceCode & RemoteSourceCode;
}

/**
 * isRemoteSourceCode checks if the given value is a RemoteSourceCode.
 */
export function isRemoteSourceCode(
  sourceCode: SourceCode,
): sourceCode is RemoteSourceCode {
  return "remote" in sourceCode && "url" in sourceCode.remote;
}

/**
 * TextSourceCode represents a text source code.
 */
export interface TextSourceCode {
  readonly text: string;
}

/**
 * isTextSourceCode checks if the given value is a TextSourceCode.
 */
export function isTextSourceCode(
  sourceCode: SourceCode,
): sourceCode is TextSourceCode {
  return "text" in sourceCode && typeof sourceCode.text === "string";
}

/**
 * RemoteSourceCode represents a source code that is fetched from a remote source.
 */
export interface RemoteSourceCode {
  readonly remote: {
    readonly url: string;
    readonly range?: SourceCodeRange;
  };
}

/**
 * SourceCodeRange targets a multi-line range of source code.
 */
export interface SourceCodeRange {
  readonly row: Range;
  readonly column?: Range;
}

/**
 * Range is a pair of start and end values.
 */
export interface Range {
  readonly start: number;
  readonly end: number;
}
