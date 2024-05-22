import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ListService } from "labs/lib/services/list.ts";
import { ReferenceItem } from "labs/lib/services/reference.ts";

/**
 * OrderedListService provides a service for managing ordered lists of items.
 */
export class OrderedListService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ orderedList: OrderedList }>,
    public readonly listService: ListService,
  ) {}

  public add(
    props: { name?: string; title: string; items?: ReferenceItem[] },
  ) {
    const listName = props.name ?? crypto.randomUUID();
    this.listService.addList({
      name: listName,
      title: props.title,
      items: props.items,
    });
    this.itemDrive.setItem("orderedList", listName, {
      listName,
      items: [...(props.items ?? [])]
        .map((item, index) => ({ ...item, index })),
    });
  }

  public get(props: { listName: string }): OrderedList | undefined {
    return this.itemDrive.getItem("orderedList", props.listName);
  }

  public indexOf(
    props: { listName: string; orderedItem: OrderedItem },
  ) {
    const list = this.itemDrive.getItem("orderedList", props.listName);
    if (list === undefined) {
      return -1;
    }

    return list.items.findIndex(
      (item) => matchItem(item, props.orderedItem),
    );
  }

  public lastIndexOf(
    props: { listName: string; orderedItem: OrderedItem },
  ) {
    const list = this.itemDrive.getItem("orderedList", props.listName);
    if (list === undefined) {
      return -1;
    }

    return list.items.findLastIndex((item) =>
      matchItem(item, props.orderedItem)
    );
  }

  public move(
    props: { listName: string; orderedItem: OrderedItem; to: number },
  ) {
    const list = this.itemDrive.getItem("orderedList", props.listName);
    if (list === undefined) {
      return;
    }

    const itemIndex = this.indexOf({
      listName: props.listName,
      orderedItem: props.orderedItem,
    });
    if (itemIndex === -1) {
      return;
    }

    const item = list.items[itemIndex];
    list.items.splice(itemIndex, 1);
    list.items.splice(props.to, 0, item);

    // Correct the index of the items after the moved item moves.
    for (let i = item.index; i < list.items.length; i++) {
      list.items[i].index = i;
    }

    this.itemDrive.setItem("orderedList", props.listName, list);
  }
}

function matchItem(a: OrderedItem, b: OrderedItem): boolean {
  return a.type === b.type && a.name === b.name && a.property === b.property;
}

/**
 * OrderedList represents a list of ordered items.
 */
export interface OrderedList {
  listName: string;
  items: OrderedItem[];
}

/**
 * OrderedItem represents an item in an ordered list.
 */
export interface OrderedItem extends ReferenceItem {
  index: number;
}
