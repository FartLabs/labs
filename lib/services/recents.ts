// Recent

import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

// TODO: Changes can be made live into the ecosystem by using the item drive.
// A new topic can be created in which a type of item is designated as a recent item.

/**
 * RecentsService provides a service for managing recent items.
 */
export class RecentsService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ recents: Recents }>,
    public readonly maxRecents: number = 10,
  ) {}

  /**
   * addRecents adds recent items.
   */
  public addRecents(props: { name: string; recentItems: RecentItem[] }) {
    const recents = this.itemDrive.getItem("recents", name) ??
      { recentItems: [] };
    for (const recentItem of props.recentItems) {
      recents.recentItems.unshift(recentItem);
    }

    recents.recentItems.splice(this.maxRecents);
    this.itemDrive.setItem("recents", props.name, recents);
    return recents;
  }

  /**
   * getRecents gets recent items.
   */
  public getRecents(props: { name: string }) {
    return this.itemDrive.getItem("recents", props.name) ?? { recentItems: [] };
  }

  /**
   * deleteRecents deletes recent items.
   */
  public deleteRecents(props: { name: string }) {
    this.itemDrive.deleteItem("recents", props.name);
  }
}

/**
 * Recents are a list of recent items.
 */
export interface Recents {
  readonly recentItems: RecentItem[];
}

/**
 * RecentItem represents a recent item.
 */
export interface RecentItem {
  readonly type: string;
  readonly name: string;
}
