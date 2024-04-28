import { Lab } from "./labs.ts";
import { makeMapLab, MapInterface, procedureGet, procedureSet } from "./map.ts";

/**
 * ItemID includes the ID and datasource of an item.
 */
export interface ItemID {
  id: string;
  datasource: string;
}

/**
 * Item includes the ID, datasource, and timestamps of an item.
 */
export interface Item extends ItemID {
  createdAt: string;
  updatedAt: string;
  discardedAt?: string;
}

export const itemsNamespace = "items" as const;

/**
 * itemsLab is a lab for managing items.
 */
export const itemsLab = makeItemsLab(new Map<string, Item>());

export function procedureAdd<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.add` as const;
}

export function procedureDiscard<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.discard` as const;
}

export function procedureRestore<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.restore` as const;
}

export function procedureUpdate<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.update` as const;
}

/**
 * makeItemsLab makes an itemized lab. This lab is intended to be used as a
 * base lab for other labs.
 */
export function makeItemsLab(storage: MapInterface<Item>) {
  const mapLab = makeMapLab(itemsNamespace, storage);
  return new Lab()
    .extend(mapLab)
    .procedure(
      procedureAdd(itemsNamespace),
      (
        request: { id?: string; datasource: string },
        { [procedureSet(itemsNamespace)]: setItem },
      ) => {
        const id = request.id ?? crypto.randomUUID();
        setItem({
          key: id,
          value: makeItem(request.datasource, id),
        });
        return { id };
      },
      [procedureSet(itemsNamespace)],
    )
    .procedure(
      procedureUpdate(itemsNamespace),
      (
        request: { id: string },
        { items, [procedureGet(itemsNamespace)]: getItem },
      ) => {
        const item = getItem({ key: request.id });
        if (item === undefined) {
          throw new Error(`No such item: ${request.id}`);
        }

        item.updatedAt = new Date().toISOString();
        items.set(item.id, item);
      },
      [itemsNamespace, procedureGet(itemsNamespace)],
    )
    .procedure(
      procedureDiscard(itemsNamespace),
      (
        request: { id: string },
        {
          [procedureGet(itemsNamespace)]: getItem,
          [procedureSet(itemsNamespace)]: setItem,
        },
      ) => {
        const item = getItem({ key: request.id });
        if (item === undefined) {
          throw new Error(`No such item: ${request.id}`);
        }

        item.discardedAt = new Date().toISOString();
        setItem({ key: item.id, value: item });
      },
      [procedureSet(itemsNamespace), procedureGet(itemsNamespace)],
    )
    .procedure(
      procedureRestore(itemsNamespace),
      (
        request: { id: string },
        { items, [procedureGet(itemsNamespace)]: getItem },
      ) => {
        const item = getItem({ key: request.id });
        if (item === undefined) {
          throw new Error(`No such item: ${request.id}`);
        }

        delete item.discardedAt;
        items.set(item.id, item);
      },
      [itemsNamespace, procedureGet(itemsNamespace)],
    );
}

function makeItem(datasource: string, id: string = crypto.randomUUID()): Item {
  const createdAt = new Date().toISOString();
  return {
    id,
    datasource,
    createdAt,
    updatedAt: createdAt,
  };
}
