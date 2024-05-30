import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * UUIDService provides a service for managing UUIDs.
 */
export class UUIDService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ uuid: UUID }>,
  ) {}
}

/**
 * UUID represents a universally unique identifier.
 */
export interface UUID {
  readonly uuid: string;
}
