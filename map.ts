import { Lab } from "./labs.ts";

/**
 * MemoryID includes the ID of an item in memory.
 */
export interface MemoryID {
  id: string;
}

/**
 * MapInterface contains the methods we use from Map.
 */
export interface MapInterface<V> {
  get(key: string): V | undefined;
  set(key: string, value: V): this;
  delete(key: string): boolean;
  values(): IterableIterator<V>;
}

/**
 * makeMapLab creates a lab for managing items in memory using a Map.
 */
export function makeMapLab<
  TMemory,
  TNamespace extends string,
>(namespace: TNamespace, storage: MapInterface<TMemory>) {
  return new Lab()
    .variable(namespace, storage)
    .procedure(
      procedureSet(namespace),
      (
        request: { key: string; value: TMemory },
        { [namespace]: items },
      ): void => {
        items.set(request.key, request.value);
      },
      [namespace],
    )
    .procedure(
      procedureDelete(namespace),
      (request: MemoryID, { [namespace]: items }): void => {
        items.delete(request.id);
      },
      [namespace],
    )
    .procedure(
      procedureGet(namespace),
      (request: MemoryID, { [namespace]: items }): TMemory | undefined => {
        return items.get(request.id);
      },
      [namespace],
    )
    .procedure(
      procedureList(namespace),
      (_, { [namespace]: items }): TMemory[] => {
        return Array.from(items.values());
      },
      [namespace],
    );
}

export function procedureDelete<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.delete` as const;
}

export function procedureGet<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.get` as const;
}

export function procedureList<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.list` as const;
}

export function procedureSet<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.set` as const;
}
