import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

export class ReferenceService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ reference: Reference }>,
  ) {}
}

export interface Reference {
  type: string;
  name: string;
}
