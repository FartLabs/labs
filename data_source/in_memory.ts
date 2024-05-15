import { DataSource } from "./data_source.ts";

/**
 * InMemoryStorage is an in-memory storage of items.
 */
export type InMemoryStorage = Map<PropertyKey, Map<string, unknown>>;

export class InMemoryDataSource implements DataSource {
  public constructor(
    private readonly storage: InMemoryStorage = new Map(),
  ) {}

  public getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return this.storage.get(type)?.get(name) as TItem | undefined;
  }

  public getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return Array.from(
      this.storage.get(type)?.entries() ?? [],
    ) as Array<[string, TItem]>;
  }

  public setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    const items = this.storage.get(type) ?? new Map();
    items.set(name, item);
    this.storage.set(type, items);
  }

  public setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    const itemMap = new Map(items);
    this.storage.set(type, itemMap);
  }
}
