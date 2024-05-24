import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
// import {
//   ReferenceItem,
//   ReferenceService,
// } from "labs/lib/services/reference.ts";

/**
 * ListService provides a service for managing lists of items.
 */
export class ListService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ list: List }>,
  ) {}

  public addList(
    props?: { name?: string; title?: string; items?: ListItem[] },
  ): List {
    const name = props?.name ?? crypto.randomUUID();
    const list: List = {
      title: props?.title,
      items: collapseItems(props?.items ?? []),
    };
    this.itemDrive.setItem("list", name, list);
    return list;
  }

  public removeList(props: { name: string }): void {
    this.itemDrive.deleteItem("list", props.name);
  }

  // Perhaps return the name of the list to rerender the list. Or add an automation step to rerender the list.
  public addItems(props: { name: string; items: ListItem[] }) {
    const existingList = this.itemDrive.getItem("list", props.name);
    if (existingList === undefined) {
      throw new Error(`list not found: ${props.name}`);
    }

    const list: List = {
      title: existingList.title,
      items: collapseItems([...existingList.items, ...props.items]),
    };
    this.itemDrive.setItem("list", props.name, list);
  }

  public deleteItems(props: { name: string; items: ListItem[] }) {
  }
}

/**
 * List represents a list of items.
 */
export interface List {
  readonly title?: string;
  readonly items: ListItem[];
}

// The opposite of "collapse" is "expand". The function "expandItems" is missing.

/**
 * collapseItems collapses the duplicate items in a list.
 */
export function collapseItems(items: ListItem[]): ListItem[] {
  if (items.length === 0) {
    return items;
  }

  const lookup = new Map<string, number>();
  return items.reduce<ListItem[]>((collapsed, item) => {
    const itemString = stringifyItem(item);
    const existingIndex = lookup.get(itemString);
    collapseItem(collapsed, item, existingIndex);
    if (existingIndex !== undefined) {
      return collapsed;
    }

    collapsed.push(item);
    lookup.set(itemString, collapsed.length - 1);
    return collapsed;
  }, []);
}

/**
 * collapseItem collapses the duplicate items in a list.
 */
export function collapseItem(
  items: ListItem[],
  item: ListItem,
  at?: number,
): void {
  if (at === undefined) {
    items.push(item);
    return;
  }

  items[at] = {
    name: items[at].name,
    type: items[at].type,
    quantity: (items[at].quantity ?? 1) + (item.quantity ?? 1),
  };
}

// TODO: Use this function to pass a custom quantity operation to the collapseItems function.
type Collapse = (q1: number, q2: number) => number | undefined;

/**
 * stringifyItem returns a string representation of an item.
 */
export function stringifyItem(item: ListItem): string {
  return `${item.type}.${item.name}`;
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
