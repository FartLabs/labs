import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ReferenceService } from "labs/lib/services/reference.ts";

// TODO: Create ordered list service given list service instance.

/**
 * ListService provides a service for managing lists of items.
 */
export class ListService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ list: List }>,
    public readonly referenceService: ReferenceService,
  ) {}

  public addList(props: { name?: string; title: string }) {
    const listName = props.name ?? crypto.randomUUID();
    this.itemDrive.setItem("list", listName, { title: props.title });
  }

  // Perhaps return the name of the list to rerender the UI.
  public appendListItem(
    props: { listName: string; type: string; name: string },
  ) {
    this.referenceService.directedReference(
      { type: "list", name: props.listName },
      { type: props.type, name: props.name },
    );
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
