import { Lab } from "./labs.ts";

export interface ItemID {
  id: string;
  datasource: string;
}

export interface Item extends ItemID {
  createdAt: string;
  updatedAt: string;
  discardedAt?: string;
}

function makeItem(datasource: string, id: string): Item {
  const createdAt = new Date().toISOString();
  return {
    id,
    datasource,
    createdAt,
    updatedAt: createdAt,
  };
}

// TODO: Tell the itemsLab which procedures to use for managing/storing relationships in `makeItemsLab` function.
// This function could be used to create new labs that use the itemsLab as a base and are compatible with other itemized labs.
// Add a procedure dependency checker that simply checks if the dependency names of a procedure are in the lab.

/**
 * itemsLab is an itemized lab. This lab is intended to be used as a base lab for other labs.
 */
export const itemsLab = new Lab()
  .variable("items", new Map<string, Item>())
  .procedure(
    "items.add",
    (request: { id?: string; datasource: string }, { items }): ItemID => {
      const id = request.id ?? crypto.randomUUID();
      // TODO: Consider using "{datasource}:{id}" as the key for the item (this would add complexity to how links are managed).
      items.set(id, makeItem(request.datasource, id));
      return { id, datasource: request.datasource };
    },
    ["items"],
  )
  .procedure(
    "items.get",
    (request: { id: string }, { items }) => {
      return items.get(request.id);
    },
    ["items"],
  )
  .procedure(
    "items.list",
    (request: { datasource?: string }, { items }) => {
      const data = Array.from(items.values());
      if (request.datasource === undefined) {
        return data;
      }

      return data.filter((item) => item.datasource === request.datasource);
    },
    ["items"],
  )
  .procedure(
    "items.update",
    (request: { id: string }, { items, "items.get": getItem }) => {
      const item = getItem(request);
      if (item === undefined) {
        throw new Error(`No such item: ${request.id}`);
      }

      item.updatedAt = new Date().toISOString();
      items.set(item.id, item);
    },
    ["items", "items.get"],
  )
  .procedure(
    "items.discard",
    (request: { id: string }, { items, "items.get": getItem }) => {
      const item = getItem(request);
      if (item === undefined) {
        throw new Error(`No such item: ${request.id}`);
      }

      item.discardedAt = new Date().toISOString();
      items.set(item.id, item);
    },
    ["items", "items.get"],
  )
  .procedure(
    "items.restore",
    (request: { id: string }, { items, "items.get": getItem }) => {
      const item = getItem(request);
      if (item === undefined) {
        throw new Error(`No such item: ${request.id}`);
      }

      delete item.discardedAt;
      items.set(item.id, item);
    },
    ["items", "items.get"],
  )
  .procedure(
    "items.delete",
    (
      request: { id: string },
      { items, "items.get": getItem },
    ) => {
      const item = getItem(request);
      if (item === undefined) {
        throw new Error(`No such item: ${request.id}`);
      }

      items.delete(request.id);
    },
    ["items", "items.get"],
  );
