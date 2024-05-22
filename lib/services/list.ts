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
    const listName = props.name ?? crypto.randomUUID();
    this.itemDrive.setItem("list", listName, { title: props.title });
    if (props.referenceItems !== undefined) {
      this.appendItems({ listName, referenceItems: props.referenceItems });
    }
  }

  public removeList(props: { name: string }) {
    this.itemDrive.deleteItem("list", props.name);
    // TODO: Remove all references to items in the list.
  }

  // Perhaps return the name of the list to rerender the list. Or add an automation step to rerender the list.
  public appendItems(
    props: { listName: string; referenceItems: ReferenceItem[] },
  ) {
    for (const item of props.referenceItems) {
      this.referenceService.directedReference(
        { type: "list", name: props.listName },
        item,
      );
    }
  }

  public removeItems(
    props: { listName: string; referenceItems: ReferenceItem[] },
  ) {
    for (const item of props.referenceItems) {
      this.removeItem({
        listName: props.listName,
        type: item.type,
        name: item.name,
      });
    }
  }

  public removeItem(
    props: { listName: string; type: string; name: string },
  ) {
    this.referenceService.directedDereference(
      { type: "list", name: props.listName },
      { type: props.type, name: props.name },
    );
  }
}

/**
 * List represents a list of items.
 */
export interface List {
  title: string;
}
