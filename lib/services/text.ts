import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * TextService provides a service for managing text.
 */
export class TextService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ text: Text }>,
  ) {}
}

/**
 * Text represents some text content.
 */
export interface Text {
  readonly content: string;
}
