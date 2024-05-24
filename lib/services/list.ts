import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import {
  ReferenceItem,
  ReferenceService,
} from "labs/lib/services/reference.ts";

/**
 * ListService provides a service for managing lists of items.
 */
export class ListService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ list: List }>,
    public readonly referenceService: ReferenceService,
  ) {}

  public addList(
    props: { name?: string; title: string; referenceItems?: ReferenceItem[] },
  ) {
    const name = props.name ?? crypto.randomUUID();
    this.itemDrive.setItem("list", name, { title: props.title });
    // if (props.referenceItems !== undefined) {
    //   this.appendItems({ name, referenceItems: props.referenceItems });
    // }
  }

  public removeList(props: { name: string }) {
    this.itemDrive.deleteItem("list", props.name);
    // TODO: Remove all references to items in the list.
  }

  // Perhaps return the name of the list to rerender the list. Or add an automation step to rerender the list.
  public appendItems(
    props: { name: string; referenceItems: ReferenceItem[] },
  ) {
    for (const item of props.referenceItems) {
      this.referenceService.directedReference(
        { type: "list", name: props.name },
        item,
      );
    }
  }

  public removeItems(
    props: { name: string; referenceItems: ReferenceItem[] },
  ) {
    for (const item of props.referenceItems) {
      this.removeItem({ name: props.name, referenceItem: item });
    }
  }

  public removeItem(
    props: { name: string; referenceItem: ReferenceItem },
  ) {
    this.referenceService.directedDereference(
      { type: "list", name: props.name },
      { type: props.referenceItem.type, name: props.referenceItem.name },
    );
  }
}

/**
 * List represents a list of items.
 */
export interface List {
  readonly title?: string;
  readonly items: ListItem[];
}

/**
 * ListItem represents an item in a list. No two items in a list expect to
 * share the same name.
 */
export interface ListItem {
  readonly type: string;
  readonly name: string;
  readonly quantity?: number;
}
