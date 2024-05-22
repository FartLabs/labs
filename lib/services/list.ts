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
    props: { name?: string; title: string; items?: ReferenceItem[] },
  ) {
    const listName = props.name ?? crypto.randomUUID();
    this.itemDrive.setItem("list", listName, { title: props.title });
    if (props.items !== undefined) {
      this.appendListItems({ listName, items: props.items });
    }
  }

  public removeList(props: { name: string }) {
    this.itemDrive.deleteItem("list", props.name);
  }

  public appendListItems(
    props: { listName: string; items: ReferenceItem[] },
  ) {
    for (const item of props.items) {
      this.referenceService.directedReference(
        { type: "list", name: props.listName },
        item,
      );
    }
  }

  // Perhaps return the name of the list to rerender the list.
  public appendListItem(
    props: { listName: string; type: string; name: string },
  ) {
    this.referenceService.directedReference(
      { type: "list", name: props.listName },
      { type: props.type, name: props.name },
    );
  }

  public removeListItems(
    props: { listName: string; items: ReferenceItem[] },
  ) {
    for (const item of props.items) {
      this.removeListItem({
        listName: props.listName,
        type: item.type,
        name: item.name,
      });
    }
  }

  public removeListItem(
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
