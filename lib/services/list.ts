import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ItemReference } from "labs/lib/services/item_reference.ts";

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
      items: collapseItems([], props?.items ?? [], collapseSum),
    };
    this.itemDrive.setItem("list", name, list);
    return list;
  }

  public deleteList(props: { name: string }): void {
    this.itemDrive.deleteItem("list", props.name);
  }

  // Perhaps return the name of the list to rerender the list. Or add an automation step to rerender the list.
  public addItems(props: { name: string; items: ListItem[] }): List {
    const existingList = this.itemDrive.getItem("list", props.name);
    const collapsedItems = collapseItems(
      existingList?.items ?? [],
      props.items,
      collapseSum,
    );
    const list: List = {
      title: existingList?.title,
      items: collapsedItems,
    };
    this.itemDrive.setItem("list", props.name, list);
    return list;
  }

  public deleteItems(props: { name: string; items: ListItem[] }) {
    const existingList = this.itemDrive.getItem("list", props.name);
    if (existingList === undefined) {
      throw new Error(`list not found: ${props.name}`);
    }

    const list: List = {
      title: existingList.title,
      items: collapseItems(existingList.items, props.items, collapseDifference),
    };
    this.itemDrive.setItem("list", props.name, list);
  }

  public getItems(props: { name: string }): ListItem[] {
    const list = this.itemDrive.getItem("list", props.name);
    if (list === undefined) {
      throw new Error(`list not found: ${props.name}`);
    }

    return list.items;
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
 * collapseItems collapses the duplicate items in a list.
 */
export function collapseItems(
  results: ListItem[],
  items: ListItem[],
  collapse: Collapse,
): ListItem[] {
  if (items.length === 0) {
    return items;
  }

  const lookup = new Map<string, number>(
    results.map((item, index) => [stringifyItem(item), index]),
  );
  return items.reduce((collapsed, item) => {
    const itemString = stringifyItem(item);
    const existingIndex = lookup.get(itemString);
    collapseItem(collapsed, item, collapse, existingIndex);
    if (existingIndex !== undefined) {
      return collapsed;
    }

    lookup.set(itemString, collapsed.length - 1);
    return collapsed;
  }, results);
}

/**
 * collapseItem collapses the duplicate items in a list.
 */
export function collapseItem(
  items: ListItem[],
  item: ListItem,
  collapse: Collapse,
  at?: number,
): void {
  if (at === undefined) {
    items.push(item);
    return;
  }

  if (items[at].type !== item.type || items[at].name !== item.name) {
    throw new Error("item type and name do not match");
  }

  items[at] = {
    name: items[at].name,
    type: items[at].type,
    quantity: collapse(items[at].quantity ?? 1, item.quantity ?? 1),
  };
}

collapseSum satisfies Collapse;

/**
 * collapseSum collapses two quantities into one.
 */
export function collapseSum(q1: number, q2: number): number {
  if (!Number.isSafeInteger(q1) || !Number.isSafeInteger(q2)) {
    throw new Error("quantity is not an integer");
  }

  return q1 + q2;
}

collapseDifference satisfies Collapse;

/**
 * collapseDifference collapses two quantities into one.
 */
export function collapseDifference(q1: number, q2: number): number {
  if (!Number.isSafeInteger(q1) || !Number.isSafeInteger(q2)) {
    throw new Error("quantity is not an integer");
  }

  if (q1 < q2) {
    throw new Error("quantity cannot be negative");
  }

  return q1 - q2;
}

/**
 * Collapse collapses two quantities into one.
 */
export type Collapse = (q1: number, q2: number) => number | undefined;

/**
 * stringifyItem returns a string representation of an item.
 */
export function stringifyItem(item: ListItem): string {
  return `${item.type}.${item.name}`;
}

/**
 * ListItem represents an item in a list. No two items in a list expect to
 * share the same type and name combination.
 */
export interface ListItem extends ItemReference {
  readonly quantity?: number;
}
