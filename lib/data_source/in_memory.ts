import { DataSource } from "./data_source.ts";

/**
 * InMemoryStorage is an in-memory storage of items.
 */
export type InMemoryStorage = Map<string, Map<string, unknown>>;

export class InMemoryDataSource implements DataSource {
  public constructor(
    private readonly storage: InMemoryStorage = new Map(),
  ) {}

  public getItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
  ): Promise<TItem | undefined> {
    return Promise.resolve(
      this.storage.get(collection)?.get(name) as TItem | undefined,
    );
  }

  public getItems<TCollection extends string, TItem>(
    collection: TCollection,
  ): Promise<Array<[string, TItem]>> {
    return Promise.resolve(Array.from(
      this.storage.get(collection)?.entries() ?? [],
    ) as Array<[string, TItem]>);
  }

  public setItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
    item: TItem,
  ) {
    const items = this.storage.get(collection) ?? new Map();
    items.set(name, item);
    this.storage.set(collection, items);
    return Promise.resolve();
  }

  public setItems<TCollection extends string, TItem>(
    collection: TCollection,
    items: Array<[string, TItem]>,
  ) {
    const itemMap = new Map(items);
    this.storage.set(collection, itemMap);
    return Promise.resolve();
  }

  public deleteItem<TCollection extends string>(
    collection: TCollection,
    name: string,
  ) {
    this.storage.get(collection)?.delete(name);
    return Promise.resolve();
  }

  public deleteItems<TCollection extends string>(collection: TCollection) {
    this.storage.delete(collection);
    return Promise.resolve();
  }
}
