import { A } from "@fartlabs/htx";
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

  public addList(
    props: { name?: string; title: string; referenceItems?: ReferenceItem[] },
  ) {
    const listName = props.name ?? crypto.randomUUID();
    this.listService.addList({
      name: listName,
      title: props.title,
      referenceItems: props.referenceItems,
    });
    this.itemDrive.setItem("orderedList", listName, {
      listName,
      referenceItems: props.referenceItems ?? [],
    });
  }

  public getList(props: { listName: string }): OrderedList | undefined {
    return this.itemDrive.getItem("orderedList", props.listName);
  }

  public indicesOf(
    props: { listName: string; query: ReferenceItemQuery },
  ) {
    const list = this.itemDrive.getItem("orderedList", props.listName);
    if (list === undefined) {
      return -1;
    }

    return list.referenceItems
      .map((
        item,
        index,
      ) => (satisfiesReferenceItemQuery(item, props.query) ? index : -1))
      .filter((index) => index !== -1);
  }

  public move(
    props: { listName: string; from: number; to: number },
  ) {
    const list = this.itemDrive.getItem("orderedList", props.listName);
    if (list === undefined) {
      return;
    }

    const item = list.referenceItems[props.from];
    list.referenceItems.splice(props.from, 1);
    list.referenceItems.splice(props.to, 0, item);
    this.itemDrive.setItem("orderedList", props.listName, list);
  }
}

export function satisfiesReferenceItemQuery(
  item: ReferenceItem,
  query: ReferenceItemQuery,
) {
  for (const property in query) {
    if (
      query[property as keyof ReferenceItemQuery] === undefined
    ) {
      continue;
    }

    if (
      item[property as keyof ReferenceItem] !==
        query[property as keyof ReferenceItemQuery]
    ) {
      return false;
    }
  }

  return true;
}

/**
 * OrderedList represents a list of ordered items.
 */
export interface OrderedList {
  listName: string;
  referenceItems: ReferenceItem[];
}

/**
 * ReferenceItemQuery represents a query for an item in an ordered list.
 */
export type ReferenceItemQuery = Partial<ReferenceItem>;
